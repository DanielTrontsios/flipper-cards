<template>
  <Toolbar style="border: none" class="m-3">
    <template #start>
      <NewQuestionDialog />
      <Button :icon="showQuestionsIcon" severity="secondary" text @click="showQuestions = !showQuestions" />
      <Button icon="pi pi-print" severity="secondary" text @click="exportCSV()" />
      <QuestionUpload />
    </template>
    <template #end>
      <Button icon="pi pi-trash" severity="danger" outlined @click="$emit('openDeleteSelectedDialog')"
        :disabled="!selectedQuestions || !selectedQuestions.length" />
    </template>
  </Toolbar>
  <Card v-if="showQuestions" class="m-3">
    <template #content>
      <DataTable ref="dt" :value="questions" paginator stripedRows :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Question } from '../types';
import { db } from '../plugins/db';
import type { DataTableRowEditSaveEvent } from 'primevue';

defineProps<{
  questions: Question[] | undefined
  selectedQuestions: Question[]
}>()
const emit = defineEmits(['update:selectedQuestions', 'openDeleteSelectedDialog']);

const dt = ref();
const editingRows = ref([]);
const showQuestions = ref(false);

const updateSelectedQuestions = (newSelectedQuestions: Question) => {
  emit('update:selectedQuestions', newSelectedQuestions);
};

const onRowEditSave = async (event: DataTableRowEditSaveEvent) => {
  let { newData } = event;
  await db.questions.put({ ...newData });
};

const exportCSV = () => {
  const tempBoolean = showQuestions.value;
  showQuestions.value = true;

  setTimeout(() => {
    dt.value?.exportCSV();
    showQuestions.value = tempBoolean;
  }, 300); // 300ms delay
};

const showQuestionsIcon = computed(() => showQuestions.value ? 'pi pi-eye-slash' : 'pi pi-eye');

</script>