// import { OpenAI } from "openai";
import { GoogleGenAI, type Part } from "@google/genai";

const config = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
};

const prompt = `Read the contents of the attached PDF file, which is in Greek. Your goal is to generate high-quality flashcards for educational purposes, focusing on the most important information for learning and retention. Ensure accuracy and completeness in your responses, maintaining the Greek language throughout.

For each flashcard, create a concise and direct Question on one side and a comprehensive yet clear Answer on the other, both in Greek.

To ensure quality, follow these guidelines:

1.  **Identify Core Concepts:** Extract and formulate questions about the fundamental concepts, definitions, principles, and key terms presented in the document.
2.  **Prioritize Important Facts:** Include flashcards that cover significant facts, figures, dates, relationships, and processes that are crucial for understanding the material.
3.  **Contextual Relevance:** Ensure that the questions directly relate to the content of the PDF and that the answers provide sufficient context for understanding. Avoid generating generic questions that are not specific to the document.
4.  **Clarity and Precision:** Formulate questions that are unambiguous and have a single, clear answer derivable from the text. Answers should be accurate, concise, and directly address the question.
5.  **Avoid Redundancy and Overlap:** Ensure that each flashcard covers a distinct piece of information to maximize learning efficiency.
6.  **Vary Question Types:** Where appropriate, use different question formats (e.g., definition, explanation, comparison, cause-and-effect) to promote deeper understanding.
7.  **Completeness and Accuracy of Answers:**
    * If a question can be answered accurately and completely using information *explicitly* present in the PDF, do so.
    * Do NOT invent or infer information not present in the PDF unless instructed otherwise in the next point.
    * If the PDF provides incomplete or insufficient information to answer a question accurately, generate a relevant answer based on general knowledge but explicitly state: "**(AI-generated answer due to lack of complete information in the document)**" at the beginning of the answer, followed by the generated content.
8.  **Comprehensive Topic Coverage:** Generate at least one flashcard for *each* distinct topic, subtopic, or section of the PDF. This ensures thorough coverage of the material. Pay attention to headings and subheadings to identify distinct topics.
9.  **Focus on Key Information:** Prioritize information that is central to understanding the subject matter. Avoid trivial details unless they are explicitly emphasized in the PDF.
10. **Maintain Language:** Ensure that both the questions and the answers are in Greek, consistent with the language of the provided PDF.
11. **Ensure Complete Answers:** When a question asks for a list, multiple factors, or a process with several steps, make sure the answer includes *all* relevant parts from the document. Do not provide partial answers if the full information is available.
12. **Synthesize Information:** If the answer to a question is spread across multiple sentences or paragraphs within the same section of the document, synthesize the information into a single, comprehensive answer.

Format the output as a plain text CSV with two columns: "Question" and "Answer", separated by a comma. Do not include any headers or additional text. Enclose fields in double quotes only if they contain a comma.

Output the CSV data only.`

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