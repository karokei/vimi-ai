import gemini, { MODELS } from '../ai/gemini';
import {
    AiStepExecutionInput,
    AiStepExecutionResult,
    AiRuntimeError,
    AiRuntimeErrorCode
} from './types';

export async function executeAiTextStep(
    input: AiStepExecutionInput
): Promise<AiStepExecutionResult> {
    const { messages, meta, temperature = 0.7 } = input;

    // Convert messages to Gemini format (simplistic for porting)
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n\n');

    try {
        const response = await gemini.models.generateContent({
            model: MODELS.TEXT,
            contents: userMessages,
            config: {
                systemInstruction: systemMessage,
                temperature,
                // stopSequences, etc. can be added if needed
            }
        });

        const text = response.text || '';

        // Usage info (Gemini SDK might provide this in response.usageMetadata)
        const usage = {
            promptTokens: (response as any).usageMetadata?.promptTokenCount || 0,
            completionTokens: (response as any).usageMetadata?.candidatesTokenCount || 0,
            totalTokens: (response as any).usageMetadata?.totalTokenCount || 0,
        };

        return {
            text,
            reasoning: '', // Gemini doesn't always provide explicit reasoning like DeepSeek
            usage,
        };
    } catch (error: any) {
        const aiError = new Error(error.message) as AiRuntimeError;
        aiError.code = mapGeminiErrorToCode(error);
        aiError.retryable = isRetryable(aiError.code);
        throw aiError;
    }
}

function mapGeminiErrorToCode(error: any): AiRuntimeErrorCode {
    const msg = error.message?.toLowerCase() || '';
    if (msg.includes('rate limit') || msg.includes('429')) return 'RATE_LIMIT';
    if (msg.includes('timeout') || msg.includes('deadline')) return 'TIMEOUT';
    if (msg.includes('sensitive') || msg.includes('safety')) return 'SENSITIVE_CONTENT';
    return 'INTERNAL_ERROR';
}

function isRetryable(code: AiRuntimeErrorCode): boolean {
    return code === 'RATE_LIMIT' || code === 'TIMEOUT' || code === 'INTERNAL_ERROR';
}
