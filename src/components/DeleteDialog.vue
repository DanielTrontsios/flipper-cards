<template>
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