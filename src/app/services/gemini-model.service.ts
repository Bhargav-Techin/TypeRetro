import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiModelService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialize GoogleGenAI client with API key
    this.ai = new GoogleGenAI({
      apiKey: environment.googleAiApiKey,
    });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || 'No response from model';
    } catch (error) {
      console.error('Error generating text:', error);
      return 'Try again by reloading the browser';
    }
  }
}
