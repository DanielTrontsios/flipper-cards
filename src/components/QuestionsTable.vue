<template>
  <Card>
    <template #content>
      <DataTable :value="questions" paginator stripedRows :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
        v-model:editingRows="editingRows" dataKey="id" editMode="row" @row-edit-save="onRowEditSave"
        :selection="selectedQuestions" @update:selection="updateSelectedQuestions">
        <Column selectionMode="multiple" :exportable="false"></Column>
        <Column field="question" header="Question" style="width: 45%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="answer" header="Answer" style="width: 45%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column :rowEditor="true" bodyStyle="text-align:center; width: 5%">
        </Column>
      </DataTable>
    </template>
  </Card>
  <!-- <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
      <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
    </template>
  </Dialog> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Question } from '../types';
import { db } from '../plugins/db';

defineProps<{
  questions: { type: Question[], required: true }
  selectedQuestions: Question[]
}>()
const emit = defineEmits(['update:selectedQuestions']);

const editingRows = ref([]);

const updateSelectedQuestions = (newSelectedQuestions: Question) => {
  emit('update:selectedQuestions', newSelectedQuestions);
};

const onRowEditSave = async (event) => {
  let { newData, index } = event;
  await db.questions.put({ ...newData });
};
</script>