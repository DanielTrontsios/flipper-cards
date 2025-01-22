<template>
  <Card>
    <template #content>
      <DataTable ref="dt" :value="questions" paginator stripedRows :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
        v-model:editingRows="editingRows" dataKey="id" editMode="row" @row-edit-save="onRowEditSave"
        :selection="selectedQuestions" @update:selection="updateSelectedQuestions">
        <template #header>
          <div class="text-end pb-4">
            <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
          </div>
        </template>
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

const dt = ref();
const exportCSV = () => {
  dt.value.exportCSV();
};
</script>