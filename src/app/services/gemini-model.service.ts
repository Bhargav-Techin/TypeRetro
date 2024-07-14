import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiModelService {
  initializeModel(model: 'gemini-pro' | 'gemini-pro-vision') {
    const googleGenerativeAI = new GoogleGenerativeAI(environment.googleAiApiKey);
    const generationConfig = {
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      ],
      temperature: 0.9,
      top_p: 1,
      top_k: 32,
      maxOutputTokens: 100,
    };
    return googleGenerativeAI.getGenerativeModel({ model, ...generationConfig });
  }

  async generateText(prompt: string): Promise<string> {
    const geminiModel = this.initializeModel('gemini-pro');
    console.log("inside text");
    try {
      const response = (await geminiModel.generateContent(prompt)).response;
      return response.text();
    } catch (error) {
      console.error('Error generating text:', error);
      return "Try again by reload the Browser"; 
    }
  }
}

