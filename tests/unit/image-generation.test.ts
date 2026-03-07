import { describe, expect, it, vi, beforeEach } from 'vitest';
import { handlePanelImageTask, handleCharacterImageTask } from '@/lib/workers/image-generation';
import { generateImage } from '@/lib/ai/gemini';
import { AIOrchestrator } from '@/lib/ai/orchestrator';

vi.mock('@/lib/ai/gemini', () => ({
    generateImage: vi.fn(),
}));

vi.mock('@/lib/novel-promotion/db', () => ({
    NovelPromotionDB: {
        updatePanelImage: vi.fn(),
        updateCharacterAppearanceImage: vi.fn()
    }
}));

// We mock AIOrchestrator in tests/setup.ts but we can re-specify some if needed
// setup.ts automatically applies vi.mock

describe('worker: image-generation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('handles panel image generation successfully', async () => {
        const job: any = {
            data: {
                taskId: 'task-1',
                projectId: 'proj-1',
                panelId: 'panel-1',
                prompt: 'A futuristic city skyline at night',
                session: { user: { id: 'user-1' } }
            }
        };

        const mockBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        (generateImage as any).mockResolvedValue(mockBase64);

        await handlePanelImageTask(job);

        expect(AIOrchestrator.updateTask).toHaveBeenCalledWith(
            'task-1',
            expect.objectContaining({ status: 'processing', progress: 10 })
        );
        expect(generateImage).toHaveBeenCalledWith(
            'A futuristic city skyline at night',
            'user-1'
        );

        // Test uploading to Supabase and DB mapping logic
        expect(AIOrchestrator.updateTask).toHaveBeenCalledWith(
            'task-1',
            expect.objectContaining({ status: 'completed', progress: 100 })
        );
    });

    it('handles character image generation successfully', async () => {
        const job: any = {
            data: {
                taskId: 'task-char-1',
                projectId: 'proj-1',
                appearanceId: 'app-1',
                prompt: 'Character reference sheet for anime boy',
                session: { user: { id: 'user-1' } }
            }
        };

        const mockBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        (generateImage as any).mockResolvedValue(mockBase64);

        await handleCharacterImageTask(job);

        expect(generateImage).toHaveBeenCalledWith(
            'Character reference sheet for anime boy',
            'user-1'
        );

        expect(AIOrchestrator.updateTask).toHaveBeenCalledWith(
            'task-char-1',
            expect.objectContaining({ status: 'completed', progress: 100 })
        );
    });
});
