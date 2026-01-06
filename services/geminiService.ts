
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

/**
 * Analyzes a plant image to diagnose diseases using Gemini 3 Flash.
 * @param base64Image The image data in base64 format (without the data:image prefix).
 * @param language The preferred language for the analysis output ('bn' or 'en').
 */
export const analyzePlantDisease = async (base64Image: string, language: 'bn' | 'en'): Promise<string> => {
  // Initialize right before making the API call to ensure use of the most up-to-date key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = language === 'bn' 
    ? "এই ছবিটিতে কোন ফসলের রোগ আছে কি? থাকলে রোগের নাম, লক্ষণ এবং প্রতিকার সম্পর্কে বিস্তারিত বাংলায় লিখুন। কৃষি বিশেষজ্ঞ হিসেবে উত্তর দিন।"
    : "Identify any plant disease in this image. If present, describe the disease name, symptoms, and treatment in English. Answer as an agricultural expert.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || (language === 'bn' ? "দুঃখিত, ছবিটি বিশ্লেষণ করা সম্ভব হয়নি।" : "Could not analyze image.");
  } catch (error) {
    console.error("Error analyzing image:", error);
    return language === 'bn' ? "ত্রুটি হয়েছে। আবার চেষ্টা করুন।" : "An error occurred during analysis. Please try again.";
  }
};

/**
 * Chats with an agricultural expert AI, maintaining conversational context.
 * @param message The current user message.
 * @param history Previous chat history.
 * @param language The preferred language for the response ('bn' or 'en').
 */
export const chatWithExpert = async (message: string, history: ChatMessage[], language: 'bn' | 'en'): Promise<string> => {
    // Initialize right before making the API call.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = language === 'bn'
        ? "আপনি বাংলাদেশের একজন অভিজ্ঞ কৃষি বিশেষজ্ঞ। কৃষকদের সহজ বাংলায় ফসলের সমস্যা, সার, বীজ এবং আবহাওয়া নিয়ে পরামর্শ দিন।"
        : "You are an experienced agricultural expert for Bangladesh. Provide advice to farmers about crops, fertilizers, seeds, and weather in simple English.";

    // Convert history into the multi-turn contents format required by the SDK.
    const contents = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
    }));
    
    // Append the new user message to the conversation context.
    contents.push({
        role: 'user',
        parts: [{ text: message }]
    });

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: { systemInstruction }
        });
        
        return response.text || (language === 'bn' ? "দুঃখিত, উত্তর পাওয়া যায়নি।" : "Sorry, I couldn't find an answer for that.");
    } catch (error) {
        console.error("Chat error:", error);
        return language === 'bn' ? "সার্ভারে সমস্যা হয়েছে।" : "A server error occurred. Please try again later.";
    }
};
