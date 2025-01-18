<template>
  <Button icon="pi pi-plus" class="mr-2" severity="secondary" text @click="visible = true" />
  <Dialog v-model:visible="visible" modal header="Add New Question">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">Populate the new question and the related
      answer.</span>

    <div class="flex flex-column gap-2 mb-4">
      <label for="question" class="font-semibold w-24">Question</label>
      <InputText v-model="question.question" :invalid="!question.question" id="question" class="flex-auto"
        autocomplete="off" />
    </div>

    <div class="flex flex-column gap-2 mb-6">
      <label for="answer" class="font-semibold w-24">Answer</label>
      <InputText v-model="question.answer" :invalid="!question.answer" id="answer" class="flex-auto"
        autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="handleCancel()"></Button>
      <Button type="button" label="Save" @click="handleSave()"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Question } from "../types";

const emit = defineEmits(['addQuestion']);

const question = ref({} as Omit<Question, 'id'>);
const visible = ref(false);

const handleCancel = () => {
  question.value = {} as Omit<Question, 'id'>;
  visible.value = false;
}

const handleSave = () => {
  if (!question.value.question || !question.value.answer) {
    return;
  }
  emit('addQuestion', question.value);
  question.value = {} as Omit<Question, 'id'>;
  visible.value = false;
};
</script>
