<template>
    <FileUpload mode='basic' name="csv[]" customUpload @select="handleFileUpload($event)" accept="text/csv"
        :maxFileSize="1000000" auto chooseIcon="pi pi-upload"
        :chooseButtonProps="{ severity: 'secondary', text: true }" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Question } from "../types"

const fileData = ref<Question[] | null>(null); // Holds the parsed object
const error = ref<string | null>(null);       // Holds any error messages

const handleFileUpload = (event) => {
    const file = event.files?.[0];

    if (!file) {
        error.value = "No file selected.";
        return;
    }

    // Check file type (CSV in this example)
    if (file.type !== "text/csv") {
        error.value = "Only CSV files are allowed.";
        return;
    }

    error.value = null; // Reset any previous errors
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
            const content = e.target?.result;
            fileData.value = parseCSV(content);
            console.log(fileData.value);
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