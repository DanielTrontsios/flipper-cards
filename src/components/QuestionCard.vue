<template>
  <Card class="m-3">
    <template #title>{{ title }}</template>
    <template #content>
      <div class="p-5" @click="showAnswer = !showAnswer">
        <p v-if="!showAnswer" class="m-0">
          {{ currentQuestion.question }}
        </p>
        <p v-animateonscroll="{ enterClass: 'animate-flipleft', leaveClass: 'animate-flipleft' }" v-else class=" m-0">
          {{ currentQuestion.answer }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-wrap md:gap-4 gap-1 mt-1">
        <Button label="I Don't Know" severity="danger" outlined class="w-full" @click="nextQuestion('dontKnow')" />
        <Button label="I Know" class="w-full" @click="nextQuestion('know')" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Question } from "../types";

defineProps<{
  currentQuestion: Question
}>()

const emit = defineEmits(['nextQuestion']);

const showAnswer = ref(false);

const nextQuestion = (type: string) => {
  showAnswer.value = false;
  emit('nextQuestion', type);
}

const title = computed(() => { return showAnswer.value ? 'Answer' : 'Question' })
</script>