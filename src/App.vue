<template>
  <QuestionsTable :questions="questions" v-model:selectedQuestions="selectedQuestions"
    @openDeleteSelectedDialog="openDeleteSelectedDialog" />

  <QuestionCard v-if="currentRunQuestions.length" :currentQuestion="currentQuestion"
    @nextQuestion="(from: string) => nextQuestion(from)" />

  <CompletionCard v-else :showReview="!!unknownQuestions.length" @reviewUnknown="reviewUnknownQuestions"
    @startOver="startOver" />

  <Dialog v-model:visible="showDeleteQuestionsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span>Are you sure you want to delete the selected questions?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="showDeleteQuestionsDialog = false" />
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

const currentQuestionIndex = ref(0);

const selectedQuestions = ref([]);
const showDeleteQuestionsDialog = ref(false);

const questions = useObservable<Question[]>(
  from(liveQuery(() => db.questions.toArray()))
);

const knownQuestions = ref<Question[]>([]);
const unknownQuestions = ref<Question[]>([]);

const currentRunQuestions = ref<Question[]>([]);
const currentQuestion = computed(() => currentRunQuestions.value[currentQuestionIndex.value]);

const nextQuestion = (from: string) => {

  if (from === 'dontKnow') {
    unknownQuestions.value.push(currentQuestion.value);
  } else {
    knownQuestions.value.push(currentQuestion.value);
  }

  if (currentQuestionIndex.value < currentRunQuestions.value.length - 1) {
    currentQuestionIndex.value++;
  } else {
    currentQuestionIndex.value = 0;
    currentRunQuestions.value = [];
  }
};

const openDeleteSelectedDialog = () => {
  showDeleteQuestionsDialog.value = true;
};

const confirmDeleteSelected = async () => {
  await db.questions.bulkDelete(selectedQuestions.value.map((question: Question) => question.id));
  showDeleteQuestionsDialog.value = false;
  selectedQuestions.value = [];
};

const reviewUnknownQuestions = () => {
  currentRunQuestions.value = unknownQuestions.value;
  currentQuestionIndex.value = 0;
  unknownQuestions.value = []
};

const startOver = () => {
  currentRunQuestions.value = [];
  currentRunQuestions.value = questions.value ? questions.value : [];
  currentQuestionIndex.value = 0;
};

// Initialize the first run with all questions
currentRunQuestions.value = questions.value ? [...questions.value] : [];
</script>
