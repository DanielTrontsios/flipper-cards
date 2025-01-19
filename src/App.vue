<template>
  <Toolbar style="border: none" class="m-3">
    <template #start>
      <NewQuestionDialog />
      <Button :icon="showQuestionsIcon" label="Questions Table" severity="secondary" text
        @click="showQuestions = !showQuestions" />
      <Button icon="pi pi-print" class="mr-2" severity="secondary" text />
      <Button icon="pi pi-upload" severity="secondary" text />
    </template>
    <template #end>
      <Button icon="pi pi-trash" severity="danger" outlined @click="openDeleteSelectedDialog"
        :disabled="!selectedQuestions || !selectedQuestions.length" />
    </template>
  </Toolbar>

  <QuestionsTable v-if="showQuestions" class="m-3" :questions="questions"
    v-model:selectedQuestions="selectedQuestions" />

  <QuestionCard v-if="questions?.length" :currentQuestion="currentQuestion"
    @nextQuestion="(from: string) => nextQuestion(from)" />

  <Card v-else style="overflow: hidden" class="m-3">
    <template #header>
      <img style="max-width: 100%; " alt="user header" src="../src/assets/success.jpg" />
    </template>
    <template #title>Congratulations</template>
    <template #content>
      <p class="m-0">
        You've completed all your questions!
      </p>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-1">
        <Button label="Start from Beginning" severity="secondary" outlined class="w-full" />
        <Button label="Review Un-known Answers" class="w-full" />
      </div>
    </template>
  </Card>

  <Dialog v-model:visible="deleteQuestionsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span>Are you sure you want to delete the selected questions?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteQuestionsDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="confirmDeleteSelected" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Question } from "./types";
import { liveQuery } from "dexie";
import { useObservable, from } from "@vueuse/rxjs";
import { db } from './plugins/db';

const showQuestions = ref(false);
const currentQuestionIndex = ref(0);

const selectedQuestions = ref([]);
const deleteQuestionsDialog = ref(false);

const questions = useObservable<Question[]>(
  from(liveQuery(() => db.questions.toArray()))
)

const knownQuestions = ref<Question[]>([]);
const unknownQuestions = ref<Question[]>([]);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

const nextQuestion = (from: string) => {
  if (from === 'dontKnow') {
    unknownQuestions.value.push(currentQuestion.value);
  } else {
    knownQuestions.value.push(currentQuestion.value);
  }

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
  console.log(knownQuestions.value);
  console.log(unknownQuestions.value);

};

const openDeleteSelectedDialog = () => {
  deleteQuestionsDialog.value = true;
};

const confirmDeleteSelected = async () => {
  await db.questions.bulkDelete(selectedQuestions.value.map((question: Question) => question.id));
  deleteQuestionsDialog.value = false;
  selectedQuestions.value = [];
  // toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const showQuestionsIcon = computed(() => showQuestions.value ? 'pi pi-eye-slash' : 'pi pi-eye');
</script>
