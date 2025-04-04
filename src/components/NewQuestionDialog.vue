<template>
  <Toast />
  <Button icon="pi pi-plus" severity="secondary" text @click="visible = true" />
  <Dialog v-model:visible="visible" modal header="Add New Question">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">Populate the new question and the related
      answer.</span>

    <div class="flex flex-column gap-2 mb-4">
      <label for="question" class="font-semibold w-24">Question</label>
      <InputText v-model="question.question" :invalid="!question.question" id="question" class="flex-auto"
        autocomplete="off" />
    </div>

    <div class="flex flex-column gap-2 mb-4">
      <label for="answer" class="font-semibold w-24">Answer</label>
      <InputText v-model="question.answer" :invalid="!question.answer" id="answer" class="flex-auto"
        autocomplete="off" />
    </div>

    <div class="flex align-items-center gap-2 mb-6 ">
      <label for="syncToCloud" class="font-semibold w-24">Sync to Cloud</label>
      <Checkbox id="syncToCloud" v-model="syncToCloud" binary :disabled="!settings.session" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="handleCancel()"></Button>
      <Button type="button" label="Save" @click="handleSave()"></Button>
      <Button type="button" label="Save & New" @click="handleSave(true)"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { db } from '../plugins/db';
import { supabase } from '../plugins/supabaseClient'
import { useSettingsStore } from '../stores/settings'

import type { Question } from "../types";

const toast = useToast();
const settings = useSettingsStore();

const question = ref({} as Omit<Question, 'id'>);
const visible = ref(false);
const syncToCloud = ref(settings.session ? true : false);

const handleCancel = () => {
  question.value = {} as Omit<Question, 'id'>;
  visible.value = false;
}

const handleSave = async (andNew: boolean = false) => {
  if (!question.value.question || !question.value.answer) {
    return;
  }
  try {
    const insertQuestion: Question = {
      id: null,
      question: question.value.question,
      answer: question.value.answer,
      synced: 0
    }
    if (syncToCloud.value && settings.session) {
      const { data, error } = await supabase
        .from('questions')
        .insert([{
          question: question.value.question,
          answer: question.value.answer
        }]).select();
      if (data) {
        insertQuestion.id = data[0].id;
        insertQuestion.synced = 1;
      } else if (error) {
        throw error;
      }
    }
    await db.questions.add(insertQuestion);

    toast.add({ severity: 'success', summary: 'Success', detail: 'New Question Added', life: 3000 });
    question.value = {} as Omit<Question, 'id'>;
    if (!andNew) visible.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
  }
};
</script>
