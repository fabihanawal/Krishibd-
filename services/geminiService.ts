import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// NOTE: In a real production app, API calls should be routed through a backend to protect the API key.
// Since this is a frontend-only request, we use the env variable.
// Make sure to set REACT_APP_GEMINI_API_KEY or similar in your build environment.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const analyzePlantDisease = async (base64Image: string, language: 'bn' | 'en'): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure the API Key.";

  const prompt = language === 'bn' 
    ? "এই ছবিটিতে কোন ফসলের রোগ আছে কি? থাকলে রোগের নাম, লক্ষণ এবং প্রতিকার সম্পর্কে বিস্তারিত বাংলায় লিখুন। কৃষি বিশেষজ্ঞ হিসেবে উত্তর দিন।"
    : "Identify any plant disease in this image. If present, describe the disease name, symptoms, and treatment in English. Answer as an agricultural expert.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
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

    return response.text || "দুঃখিত, ছবিটি বিশ্লেষণ করা সম্ভব হয়নি। (Could not analyze image)";
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "ত্রুটি হয়েছে। আবার চেষ্টা করুন। (Error occurred)";
  }
};

export const chatWithExpert = async (message: string, history: ChatMessage[], language: 'bn' | 'en'): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    // Simplify history for the model context
    // In a real app, you would manage chat history more robustly
    const systemInstruction = language === 'bn'
        ? "আপনি বাংলাদেশের একজন অভিজ্ঞ কৃষি বিশেষজ্ঞ। কৃষকদের সহজ বাংলায় ফসলের সমস্যা, সার, বীজ এবং আবহাওয়া নিয়ে পরামর্শ দিন।"
        : "You are an experienced agricultural expert for Bangladesh. Provide advice to farmers about crops, fertilizers, seeds, and weather in simple English.";

    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction }
        });
        
        // Note: For this stateless demo, we aren't maintaining the full history object on the chat instance 
        // across re-renders perfectly without a backend, but we can send the last message. 
        // For a better experience, we'd pass `history` to `history` param of `create`.
        
        const response = await chat.sendMessage({ message });
        return response.text || "দুঃখিত, উত্তর পাওয়া যায়নি।";
    } catch (error) {
        console.error("Chat error:", error);
        return "সার্ভারে সমস্যা হয়েছে।";
    }
}