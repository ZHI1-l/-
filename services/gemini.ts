import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model Constants
const DICTIONARY_MODEL = "gemini-2.5-flash";
const COMPARISON_MODEL = "gemini-2.5-flash"; // Or gemini-3-pro-preview for deeper reasoning if needed

/**
 * Searches for a legal term and returns a Collins-style dictionary entry.
 */
export const searchLegalTerm = async (query: string): Promise<string> => {
  const systemInstruction = `
    You are a distinguished Legal English lexicographer and translator, modeled after the style of the Collins COBUILD Dictionary and Black's Law Dictionary. 
    
    Your task is to explain the provided legal term (which may be in English or Chinese).
    
    Rules:
    1. If the input is English, provide the Chinese translation, a clear English definition, and a Chinese explanation.
    2. If the input is Chinese, provide the English translation(s), and explain the English legal concept.
    3. **Crucial**: Adopt the "Collins Style" of defining words using full sentences (e.g., "If you refer to a contract as void, you mean that...").
    4. Provide 2-3 bilingual example sentences in a legal context (Contracts, Torts, Criminal Law, etc.).
    5. List any relevant collocations (idiomatic phrases).
    6. Format the output using clean Markdown (Bold key terms, use bullet points).
  `;

  try {
    const response = await ai.models.generateContent({
      model: DICTIONARY_MODEL,
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Low temperature for factual accuracy
      },
    });

    return response.text || "No definition found.";
  } catch (error) {
    console.error("Dictionary Search Error:", error);
    throw new Error("Unable to retrieve definition. Please try again.");
  }
};

/**
 * Compares multiple English translations against a Chinese standard term.
 */
export const compareLegalTerms = async (
  chineseTerm: string,
  englishCandidates: string[]
): Promise<ComparisonResponse> => {
  
  const prompt = `
    Chinese Legal Term (Standard): "${chineseTerm}"
    Candidate English Translations: ${JSON.stringify(englishCandidates)}

    Task:
    Analyze how appropriate each English candidate is as a translation for the Chinese legal term in a formal legal context (e.g., contracts, court documents).
    
    For each candidate:
    1. Assign a compatibility score from 0 to 100 (100 being a perfect, legally binding equivalent).
    2. Provide a concise reason explaining the nuance, legal accuracy, or potential ambiguity.

    Return the result strictly as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: COMPARISON_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  reason: { type: Type.STRING },
                },
                required: ["term", "score", "reason"],
              },
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as ComparisonResponse;
  } catch (error) {
    console.error("Comparison Error:", error);
    throw new Error("Unable to analyze terms. Please check your inputs.");
  }
};
