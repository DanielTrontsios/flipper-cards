<template>
  <Card style="overflow: hidden" class="m-3">
    <template #header>
      <img style="max-width: 100%; " alt="user header" src="../assets/success.jpg" />
    </template>
    <template #title>Congratulations</template>
    <template #content>
      <p class="m-0">
        You've completed all your questions!
      </p>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-1">
        <Button label="Start from Beginning" severity="secondary" outlined class="w-full" @click="$emit('startOver')" />
        <Button v-if="showReview" label="Review Un-known Answers" class="w-full" @click="$emit('reviewUnknown')" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
defineProps<{
  showReview: boolean
}>()
</script>