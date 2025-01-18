<template>
  <Card class="m-3">
    <template #title>Simple Card</template>
    <template #content>
      <div @click="showAnswer = !showAnswer">
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
        <Button label="I Don't Know" severity="danger" outlined class="w-full"
          @click="$emit('nextQuestion', 'dontKnow')" />
        <Button label="I Know" class="w-full" @click="$emit('nextQuestion', 'know')" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Question } from "../types";

defineProps<{
  currentQuestion: { type: Question, required: true }
}>()

const showAnswer = ref(false);

</script>