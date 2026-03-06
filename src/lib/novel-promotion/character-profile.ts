import { executeAiTextStep } from '@/lib/ai-runtime/index';
import { PromptManager, PROMPT_IDS } from '@/lib/ai/prompt-manager';

export async function executeCharacterProfile(
    input: string,
    charactersLibInfo: string,
    session: any,
    projectId: string,
    projectName: string,
    locale: string = 'zh'
) {
    console.log(`[CharacterProfile] Analyzing characters in content...`);

    const prompt = PromptManager.buildPrompt(PROMPT_IDS.NP_AGENT_CHARACTER_PROFILE, {
        input,
        characters_lib_info: charactersLibInfo || 'None'
    });

    const result = await executeAiTextStep({
        userId: session.user.id,
        model: 'gemini-3-pro',
        messages: [{ role: 'user', content: prompt }],
        reasoning: true,
        projectId,
        action: 'character_profile',
        meta: {
            stepId: 'character_profile',
            stepTitle: 'Trích xuất nhân vật',
            stepIndex: 1,
            stepTotal: 1,
        },
    });

    if (!result.text) throw new Error('AI returned empty response for character profile');

    const jsonMatch = result.text.match(/```json\s*([\s\S]*?)\s*```/) || result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse character profile JSON');

    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
}
