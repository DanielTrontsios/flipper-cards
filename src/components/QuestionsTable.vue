<template>
  <Card>
    <template #content>
      <DataTable :value="questions" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <Column field="question" header="Question" style="width: 50%"></Column>
        <Column field="answer" header="Answer" style="width: 50%"></Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { Question } from '../types';

defineProps<{
  questions: { type: Question, required: true }
}>()
</script>