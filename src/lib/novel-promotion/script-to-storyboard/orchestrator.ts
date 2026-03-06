import { buildCharactersIntroduction } from '../../constants'
import { normalizeAnyError, createScopedLogger } from '../../utils-core'
import {
    type ActingDirection,
    type CharacterAsset,
    type ClipCharacterRef,
    type LocationAsset,
    type PhotographyRule,
    type StoryboardPanel,
    formatClipId,
    getFilteredAppearanceList,
    getFilteredFullDescription,
    getFilteredLocationsDescription,
} from '../../storyboard-phases'

type JsonRecord = Record<string, unknown>
const orchestratorLogger = createScopedLogger({ module: 'worker.orchestrator.script_to_storyboard' })

export type ScriptToStoryboardStepMeta = {
    stepId: string
    stepAttempt?: number
    stepTitle: string
    stepIndex: number
    stepTotal: number
}

export type ScriptToStoryboardStepOutput = {
    text: string
    reasoning: string
}

type ClipInput = {
    id: string
    content: string | null
    characters: string | null
    location: string | null
    screenplay: string | null
}

export type ScriptToStoryboardPromptTemplates = {
    planPromptTemplate: string
    cinematographerPromptTemplate: string
    actingPromptTemplate: string
    detailPromptTemplate: string
}

export type ClipStoryboardPanels = {
    clipId: string
    clipIndex: number
    finalPanels: StoryboardPanel[]
}

export type ScriptToStoryboardOrchestratorInput = {
    clips: ClipInput[]
    novelPromotionData: {
        characters: CharacterAsset[]
        locations: LocationAsset[]
    }
    promptTemplates: ScriptToStoryboardPromptTemplates
    runStep: (
        meta: ScriptToStoryboardStepMeta,
        prompt: string,
        action: string,
        maxOutputTokens: number,
    ) => Promise<ScriptToStoryboardStepOutput>
}

export type ScriptToStoryboardOrchestratorResult = {
    clipPanels: ClipStoryboardPanels[]
    summary: {
        clipCount: number
        totalPanelCount: number
        totalStepCount: number
    }
}

export class JsonParseError extends Error {
    rawText: string
    constructor(message: string, rawText: string) {
        super(message)
        this.name = 'JsonParseError'
        this.rawText = rawText
    }
}

function parseJsonArray<T extends JsonRecord>(responseText: string, label: string): T[] {
    let jsonText = responseText.trim()
    jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '')

    const firstBracket = jsonText.indexOf('[')
    const lastBracket = jsonText.lastIndexOf(']')
    if (firstBracket === -1 || lastBracket === -1 || lastBracket <= firstBracket) {
        throw new JsonParseError(`${label}: JSON format invalid`, responseText)
    }

    let parsed: unknown
    try {
        parsed = JSON.parse(jsonText.slice(firstBracket, lastBracket + 1))
    } catch (e) {
        throw new JsonParseError(
            `${label}: JSON parse error: ${e instanceof Error ? e.message : String(e)}`,
            responseText,
        )
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new JsonParseError(`${label}: empty result`, responseText)
    }
    const rows = parsed.filter((item): item is T => typeof item === 'object' && item !== null)
    if (rows.length === 0) {
        throw new JsonParseError(`${label}: invalid payload`, responseText)
    }
    return rows
}

function parseClipCharacters(raw: string | null): ClipCharacterRef[] {
    if (!raw) return []
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
        if (!Array.isArray(parsed)) throw new Error('characters must be array')
        return parsed as ClipCharacterRef[]
    } catch { return [] }
}

function parseScreenplay(raw: string | null): any {
    if (!raw) return null
    try {
        return typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch { return null }
}

function withStepMeta(stepId: string, stepTitle: string, stepIndex: number, stepTotal: number): ScriptToStoryboardStepMeta {
    return { stepId, stepTitle, stepIndex, stepTotal }
}

function mergePanelsWithRules(params: {
    finalPanels: StoryboardPanel[]
    photographyRules: PhotographyRule[]
    actingDirections: ActingDirection[]
}) {
    const { finalPanels, photographyRules, actingDirections } = params
    return finalPanels.map((panel) => {
        const rules = photographyRules.find((rule) => rule.panel_number === panel.panel_number)
        const acting = actingDirections.find((item) => item.panel_number === panel.panel_number)

        return {
            ...panel,
            photographyPlan: rules ? {
                composition: rules.composition,
                lighting: rules.lighting,
                colorPalette: rules.color_palette,
                atmosphere: rules.atmosphere,
                technicalNotes: rules.technical_notes,
            } : undefined,
            actingNotes: acting ? acting.characters : undefined,
        }
    })
}

const MAX_STEP_ATTEMPTS = 3

async function runStepWithRetry<T>(
    runStep: ScriptToStoryboardOrchestratorInput['runStep'],
    baseMeta: ScriptToStoryboardStepMeta,
    prompt: string,
    action: string,
    maxOutputTokens: number,
    parse: (text: string) => T,
): Promise<{ output: ScriptToStoryboardStepOutput; parsed: T }> {
    let lastError: Error | null = null
    for (let attempt = 1; attempt <= MAX_STEP_ATTEMPTS; attempt++) {
        const meta = { ...baseMeta, stepAttempt: attempt }
        try {
            const output = await runStep(meta, prompt, action, maxOutputTokens)
            const parsed = parse(output.text)
            return { output, parsed }
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error))
            if (attempt === MAX_STEP_ATTEMPTS) break
            await new Promise(r => setTimeout(r, 1000 * attempt))
        }
    }
    throw lastError!
}

export async function runScriptToStoryboardOrchestrator(
    input: ScriptToStoryboardOrchestratorInput,
): Promise<ScriptToStoryboardOrchestratorResult> {
    const { clips, novelPromotionData, promptTemplates, runStep } = input
    const totalStepCount = clips.length * 4

    const charactersLibName = (novelPromotionData.characters || []).map((c) => c.name).join(', ') || 'None'
    const locationsLibName = (novelPromotionData.locations || []).map((l) => l.name).join(', ') || 'None'
    const charactersIntroduction = buildCharactersIntroduction(novelPromotionData.characters || [])

    const clipPanels = await Promise.all(
        clips.map(async (clip, index): Promise<ClipStoryboardPanels> => {
            const clipIndex = index + 1
            const clipCharacters = parseClipCharacters(clip.characters)
            const filteredAppearanceList = getFilteredAppearanceList(novelPromotionData.characters || [], clipCharacters)
            const filteredFullDescription = getFilteredFullDescription(novelPromotionData.characters || [], clipCharacters)
            const filteredLocationsDescription = getFilteredLocationsDescription(
                novelPromotionData.locations || [],
                clip.location || null,
            )

            const phase1Prompt = promptTemplates.planPromptTemplate
                .replace('{characters_lib_name}', charactersLibName)
                .replace('{locations_lib_name}', locationsLibName)
                .replace('{characters_introduction}', charactersIntroduction)
                .replace('{characters_appearance_list}', filteredAppearanceList)
                .replace('{characters_full_description}', filteredFullDescription)
                .replace('{clip_content}', clip.content || '')

            const { parsed: planPanels } = await runStepWithRetry(
                runStep,
                withStepMeta(`clip_${clip.id}_p1`, 'Lập kế hoạch phân cảnh', clipIndex, totalStepCount),
                phase1Prompt,
                'storyboard_phase1',
                2600,
                (text) => parseJsonArray<StoryboardPanel>(text, 'phase1')
            )

            const phase2Prompt = promptTemplates.cinematographerPromptTemplate
                .replace('{panels_json}', JSON.stringify(planPanels, null, 2))
                .replace(/\{panel_count\}/g, String(planPanels.length))
                .replace('{locations_description}', filteredLocationsDescription)
                .replace('{characters_info}', filteredFullDescription)

            const phase2ActingPrompt = promptTemplates.actingPromptTemplate
                .replace('{panels_json}', JSON.stringify(planPanels, null, 2))
                .replace(/\{panel_count\}/g, String(planPanels.length))
                .replace('{characters_info}', filteredFullDescription)

            const phase3Prompt = promptTemplates.detailPromptTemplate
                .replace('{panels_json}', JSON.stringify(planPanels, null, 2))
                .replace('{characters_age_gender}', filteredFullDescription)
                .replace('{locations_description}', filteredLocationsDescription)

            const [
                { parsed: photographyRules },
                { parsed: actingDirections },
                { parsed: detailPanels },
            ] = await Promise.all([
                runStepWithRetry(runStep, withStepMeta(`clip_${clip.id}_p2c`, 'Thiết kế góc quay', clipIndex, totalStepCount), phase2Prompt, 'storyboard_phase2_c', 2400, (text) => parseJsonArray<PhotographyRule>(text, 'phase2c')),
                runStepWithRetry(runStep, withStepMeta(`clip_${clip.id}_p2a`, 'Hướng dẫn diễn xuất', clipIndex, totalStepCount), phase2ActingPrompt, 'storyboard_phase2_a', 2400, (text) => parseJsonArray<ActingDirection>(text, 'phase2a')),
                runStepWithRetry(runStep, withStepMeta(`clip_${clip.id}_p3`, 'Chi tiết phân cảnh', clipIndex, totalStepCount), phase3Prompt, 'storyboard_phase3', 2600, (text) => parseJsonArray<StoryboardPanel>(text, 'phase3')),
            ])

            return {
                clipId: clip.id,
                clipIndex,
                finalPanels: mergePanelsWithRules({
                    finalPanels: detailPanels,
                    photographyRules,
                    actingDirections,
                }),
            }
        })
    )

    return {
        clipPanels,
        summary: {
            clipCount: clips.length,
            totalPanelCount: clipPanels.reduce((s, c) => s + c.finalPanels.length, 0),
            totalStepCount,
        }
    }
}

import { executeAiTextStep } from '@/lib/ai-runtime/index'
import { PromptManager, PROMPT_IDS } from '@/lib/ai/prompt-manager'

export async function executeScriptToStoryboard(
    clipIds: string[],
    novelPromotionData: any,
    session: any,
    projectId: string,
    projectName: string,
    locale: string = 'zh',
    taskId?: string
): Promise<ScriptToStoryboardOrchestratorResult> {
    // This is a simplified version, ideally we fetch clips from DB here
    const clips = clipIds.map(id => ({ id, content: '', characters: null, location: null, screenplay: null }))

    return runScriptToStoryboardOrchestrator({
        clips,
        novelPromotionData,
        promptTemplates: {
            planPromptTemplate: PromptManager.getTemplate(PROMPT_IDS.NP_AGENT_STORYBOARD_PLAN),
            cinematographerPromptTemplate: PromptManager.getTemplate(PROMPT_IDS.NP_AGENT_CINEMATOGRAPHER),
            actingPromptTemplate: PromptManager.getTemplate(PROMPT_IDS.NP_AGENT_ACTING_DIRECTION),
            detailPromptTemplate: PromptManager.getTemplate(PROMPT_IDS.NP_AGENT_STORYBOARD_DETAIL),
        },
        runStep: async (meta, prompt, action) => {
            const result = await executeAiTextStep({
                userId: session.user.id,
                model: 'gemini-3-pro',
                messages: [{ role: 'user', content: prompt }],
                projectId,
                action,
                meta: { ...meta, stepTotal: meta.stepTotal || 1 }
            });
            return { text: result.text || '', reasoning: '' }
        },
    })
}
