<template>
    <FileUpload mode='basic' name="csv[]" customUpload @select="handleFileUpload($event)" accept="text/csv"
        :maxFileSize="1000000" auto chooseIcon="pi pi-upload"
        :chooseButtonProps="{ severity: 'secondary', text: true }" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Question } from "../types"
import { db } from '../plugins/db';

const error = ref<string | null>(null);       // Holds any error messages

const handleFileUpload = (event) => {
    const file = event.files?.[0];
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
            const content = e.target?.result;
            if (content) db.questions.bulkAdd(parseCSV(content?.toString()));
        } catch (err) {
            error.value = "Failed to parse the file.";
            console.error(err);
        }
    };

    reader.onerror = () => {
        error.value = "Failed to read the file.";
    };

    reader.readAsText(file); // Read the file content
}

const parseCSV = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const result: Omit<Question, 'id'>[] = [];

    for (const line of lines) {
        console.log(line);

        const [question, answer] = line.split(',').map(part => part.trim());
        if (question && answer) {
            result.push({ question, answer });
        }
    }

    return result;
}
</script>