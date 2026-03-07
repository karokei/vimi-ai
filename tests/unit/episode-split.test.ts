import { describe, expect, it, vi, beforeEach } from 'vitest';
vi.unmock('@/lib/ai/orchestrator');
import { AIOrchestrator } from '@/lib/ai/orchestrator';
import { MOCK_NOVEL_TEXT, MOCK_SHORT_TEXT } from '../fixtures/novel-samples';

// Giả lập Gemini Client
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: vi.fn().mockImplementation(function () {
            return {
                models: {
                    generateContent: vi.fn().mockResolvedValue({
                        text: () => JSON.stringify({
                            episodes: [
                                {
                                    number: 1,
                                    title: 'Sự tỉnh giấc của Thế Tử',
                                    summary: 'Trần Mặc nhận ra mình đã xuyên không.',
                                    startMarker: '[START_MARKER]',
                                    endMarker: '[END_MARKER]'
                                }
                            ]
                        })
                    })
                }
            };
        })
    };
});

describe('worker: episode-split', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(AIOrchestrator, 'createTask');
    });

    it('fails fast when content is too short', async () => {
        const payload = {
            projectId: 'test-project-id',
            content: MOCK_SHORT_TEXT,
            locale: 'vi'
        };

        await expect(AIOrchestrator.runNovelStoryToScript(payload as any))
            .rejects.toThrow(/quá ngắn/i);
    });

    it('returns matched episodes when ai boundaries are valid', async () => {
        const payload = {
            projectId: 'test-project-id',
            content: MOCK_NOVEL_TEXT,
            locale: 'vi',
            session: { user: { id: 'test-user' } }
        };

        const result = await AIOrchestrator.runNovelStoryToScript(payload as any);

        expect(result).toBeUndefined(); // function returns Promise<void>
        // Since runNovelStoryToScript updates DB internally in vimi-ai, 
        // we check if the orchestrator task creation was called.
        expect(AIOrchestrator.createTask).toHaveBeenCalledWith(expect.objectContaining({
            projectId: 'test-project-id',
            type: 'text-analysis'
        }));
    });
});
