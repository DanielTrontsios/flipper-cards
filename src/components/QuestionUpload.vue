<template>
    <FileUpload mode='basic' name="file[]" customUpload @select="handleFileUpload($event)" accept=".csv,.pdf"
        :maxFileSize="10000000" auto chooseIcon="pi pi-upload" settings.isFileUploading=false;
        :chooseButtonProps="{ severity: 'secondary', text: true }" :disabled="settings.isFileUploading" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Question } from "../types";
import { db } from '../plugins/db';
import type { FileUploadSelectEvent } from 'primevue';
import { pdfToCsvString } from '../plugins/openai';
import { useSettingsStore } from '../stores/settings'

const settings = useSettingsStore();
const error = ref<string | null>(null); // Holds any error messages

const handleFileUpload = async (event: FileUploadSelectEvent) => {
    const file = event.files?.[0];
    if (!file) {
        error.value = "No file selected.";
        return;
    }

    const reader = new FileReader();
    let csvString;

    settings.isFileUploading = true;
    // Check the file type
    if (file.type === "application/pdf") {
        // If the file is a PDF, read it as a Data URL
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const content = reader.result.split(',')[1];
            if (content) {
                csvString = await pdfToCsvString(content);
                const parsedData = parseCSV(csvString);
                await db.questions.bulkAdd(parsedData);
                settings.isFileUploading = false;
            };
        };
    } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        // If the file is a CSV, read it as text
        reader.readAsText(file);

        reader.onload = async () => {
            try {
                const content = reader.result;
                console.log(content);

                if (content) {
                    csvString = content.toString();
                    const parsedData = parseCSV(csvString);
                    await db.questions.bulkAdd(parsedData);
                    settings.isFileUploading = false;
                };
            } catch (err) {
                error.value = "Failed to parse the CSV file.";
                console.error(err);
                settings.isFileUploading = false;
            }
        };
    } else {
        error.value = "Unsupported file type. Please upload a .csv or .pdf file.";
        settings.isFileUploading = false;
    }

    reader.onerror = () => {
        error.value = "Failed to read the file.";
    };
};

const parseCSV = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const result: Omit<Question, 'id'>[] = [];

    for (const line of lines) {
        const [question, answer] = line.split(',').map(part => part.trim());
        if (question && answer) {
            result.push({ question, answer });
        }
    }

    return result;
};
</script>