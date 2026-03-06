import { executeAiTextStep } from '@/lib/ai-runtime/index';
import { PromptManager, PROMPT_IDS } from '@/lib/ai/prompt-manager';
import { countWords } from '@/lib/utils-core';

export async function executeEpisodeSplit(
    content: string,
    session: any,
    projectId: string,
    projectName: string,
    locale: string = 'zh'
) {
    console.log(`[EpisodeSplit] Analyzing content (${content.length} chars)...`);

    const prompt = PromptManager.buildPrompt(PROMPT_IDS.NP_EPISODE_SPLIT, {
        CONTENT: content
    });

    const result = await executeAiTextStep({
        userId: session.user.id,
        model: 'gemini-3-pro', // Default to pro for analysis
        messages: [{ role: 'user', content: prompt }],
        reasoning: true,
        projectId,
        action: 'episode_split',
        meta: {
            stepId: 'episode_split',
            stepTitle: 'Phân tập tiểu thuyết',
            stepIndex: 1,
            stepTotal: 1,
        },
    });

    if (!result.text) throw new Error('AI returned empty response for episode split');

    // Parse JSON from markdown
    const jsonMatch = result.text.match(/```json\s*([\s\S]*?)\s*```/) || result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse episode split JSON');

    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    // Process episodes
    const episodes = (parsed.episodes || []).map((ep: any) => ({
        ...ep,
        estimatedWords: ep.estimatedWords || (ep.content ? countWords(ep.content) : 0)
    }));

    return {
        episodes,
        analysis: parsed.analysis
    };
}
