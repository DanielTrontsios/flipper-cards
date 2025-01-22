import type { Question } from "../types"

export function handleFileUpload(event): void {
  const file = event.files?.[0];
  let error = null;

  if (!file) {
    error = "No file selected.";
    return;
  }

  // Check file type (CSV in this example)
  if (file.type !== "text/csv") {
    error = "Only CSV files are allowed.";
    return;
  }

  error = null; // Reset any previous errors
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

export function parseCSV(content: string): Omit<Question, 'id'>[] {
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