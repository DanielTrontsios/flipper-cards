// import { OpenAI } from "openai";
import { GoogleGenAI, type Part } from "@google/genai";

const config = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
};

const prompt = `Read the contents of the attached PDF file. From the information in the document, generate a list of flashcards suitable for study or review purposes.

Each flashcard should consist of a concise Question and a clear, informative Answer.

Focus on the key concepts, definitions, facts, and important points in the text.

Avoid overly complex or ambiguous questions.

Format the output as a CSV with two columns: Question and Answer.

Use plain text CSV format (no quotation marks around fields unless needed, comma as delimiter).

Aim for comprehensive coverage without redundancy.

Give me the CSV output only, without any additional text, formating or explanation.`

export const client = new GoogleGenAI(config);

export const pdfToCsvString = async (fileBase64: String) => {
  const contents = [
    { text: prompt },
    {
      inlineData: {
        mimeType: 'application/pdf',
        data: fileBase64
      }
    }
  ] as Part[];

  const response = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
  });

  return response.text || null;
}