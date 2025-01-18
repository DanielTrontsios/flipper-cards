<script setup lang="ts">
import { ref, computed } from "vue";
import type { Question } from "./types";

const showAnswer = ref(false);

const currentQuestionIndex = ref(0);

const questions = ref<Question[]>([
  { id: '1', question: 'Is this correct?', answer: 'this is the answer!' },
  { id: '2', question: 'Is the second correct?', answer: 'this is the second answer!' }])

const knownQuestions = ref<Question[]>([]);
const unknownQuestions = ref<Question[]>([]);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
</script>

<template>
  <Card class="m-3">
    <template #title>Simple Card</template>
    <template #content>
      <div @click="showAnswer = !showAnswer">
        <p v-if="!showAnswer" class="m-0">
          {{ currentQuestion.question }}
        </p>
        <p v-else class="m-0">
          {{ currentQuestion.answer }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-wrap md:gap-4 gap-1 mt-1">
        <Button label="I Don't Know" severity="danger" outlined class="w-full" />
        <Button label="I Know" class="w-full" />
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
