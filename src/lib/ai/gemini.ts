import { GoogleGenAI } from "@google/genai";

// === Initialize Google AI Client ===
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
});

export default ai;

// === Model Constants ===
export const MODELS = {
    /** Text analysis, script creation, prompt generation */
    TEXT: "gemini-3.1-flash-lite-preview",

    /** Image generation — Nano Banana 2 */
    IMAGE: "gemini-3.1-flash-image-preview",

    /** Image editing — Nano Banana 2 */
    IMAGE_EDIT: "gemini-3.1-flash-image-preview",

    /** Video generation — Veo 3.1 */
    VIDEO: "veo-3.1-generate-preview",

    /** Text-to-Speech */
    TTS: "gemini-2.5-flash-preview-tts",

    /** Music generation — Lyria */
    MUSIC: "lyria-realtime-exp",
} as const;

// === Capability Types ===
export type AICapability =
    | "text-analysis"
    | "image-generation"
    | "image-editing"
    | "video-generation"
    | "tts"
    | "music-generation";

// === Model → Capability Mapping ===
export const CAPABILITY_MODEL_MAP: Record<AICapability, string> = {
    "text-analysis": MODELS.TEXT,
    "image-generation": MODELS.IMAGE,
    "image-editing": MODELS.IMAGE_EDIT,
    "video-generation": MODELS.VIDEO,
    tts: MODELS.TTS,
    "music-generation": MODELS.MUSIC,
};

// === Helper: Get model for a capability ===
export function getModelForCapability(capability: AICapability): string {
    return CAPABILITY_MODEL_MAP[capability];
}

// === Helper: Generate text content ===
export async function generateText(
    prompt: string,
    systemInstruction?: string
) {
    const response = await ai.models.generateContent({
        model: MODELS.TEXT,
        contents: prompt,
        config: systemInstruction
            ? { systemInstruction }
            : undefined,
    });
    return response.text;
}

// === Helper: Generate structured JSON ===
export async function generateJSON<T>(
    prompt: string,
    systemInstruction?: string
): Promise<T> {
    const response = await ai.models.generateContent({
        model: MODELS.TEXT,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            ...(systemInstruction ? { systemInstruction } : {}),
        },
    });
    return JSON.parse(response.text ?? "{}") as T;
}
