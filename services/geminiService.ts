
import { GoogleGenAI, Type } from "@google/genai";
import { InspectionResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePropertyImages = async (
  baselineBase64: string,
  currentBase64: string,
  roomType: string = 'Living Room'
): Promise<InspectionResult> => {
  // Extract pure base64 from data URL if needed
  const cleanBase64 = (str: string) => str.split(',')[1] || str;

  const prompt = `
    You are an expert property inspector for luxury vacation rentals.
    I am providing two images: a BASELINE image (before the guest stay) and a CURRENT image (after checkout).
    
    TASK:
    1. Compare the two images carefully.
    2. Identify any:
       - DAMAGE: Scratches, stains, breaks, tears, or broken items.
       - MISSING_ITEM: Objects in the baseline that are gone in the current photo.
       - CLEANLINESS: Mess, spills, or uncleaned areas.
       - MOVED: Significant furniture displacement.
    3. Provide an estimated cost for repair or replacement in USD.
    4. Room context: ${roomType}.

    Respond ONLY in valid JSON format matching this schema:
    {
      "findings": [
        {
          "id": "string",
          "type": "DAMAGE | MISSING_ITEM | CLEANLINESS | MOVED",
          "item": "string",
          "description": "string",
          "severity": "LOW | MEDIUM | HIGH | CRITICAL",
          "confidence": number (0.0-1.0),
          "estimatedCost": "string (e.g. $50-$100)",
          "location": "string (e.g. center, top-left)"
        }
      ],
      "summary": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            { text: "BASELINE IMAGE (Before Stay):" },
            { inlineData: { mimeType: "image/jpeg", data: cleanBase64(baselineBase64) } },
            { text: "CURRENT IMAGE (After Stay):" },
            { inlineData: { mimeType: "image/jpeg", data: cleanBase64(currentBase64) } },
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    
    return {
      findings: parsed.findings || [],
      summary: parsed.summary || "No issues detected.",
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw new Error("Failed to analyze images. Please try again.");
  }
};
