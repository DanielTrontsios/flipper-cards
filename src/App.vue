<template>
  <Toolbar style="border: none" class="m-3">
    <template #start>
      <NewQuestionDialog @addQuestion="(question: Omit<Question, 'id'>) => addQuestion(question)" />
      <Button :icon="showQuestionsIcon" label="Questions Table" severity="secondary" text
        @click="showQuestions = !showQuestions" />
      <Button icon="pi pi-print" class="mr-2" severity="secondary" text />
      <Button icon="pi pi-upload" severity="secondary" text />
    </template>
  </Toolbar>
  <QuestionsTable v-if="showQuestions" class="m-3" :questions="questions" />

  <QuestionCard :currentQuestion="currentQuestion" @nextQuestion="(from: string) => nextQuestion(from)" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Question } from "./types";
const showQuestions = ref(false);
const currentQuestionIndex = ref(0);

const questions = ref<Question[]>([
  { id: '1', question: 'Is this correct?', answer: 'this is the answer!' },
  { id: '2', question: 'Is the second correct?', answer: 'this is the second answer!' }])

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

const addQuestion = (question: Omit<Question, 'id'>) => {
  questions.value.push({ ...question, id: (questions.value.length + 1).toString() });
};

const showQuestionsIcon = computed(() => showQuestions.value ? 'pi pi-eye-slash' : 'pi pi-eye');
</script>
