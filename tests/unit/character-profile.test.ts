import { describe, expect, it, vi, beforeEach } from 'vitest';
import { generateCharacterDescriptionFromImage, buildCharacterReferenceSheetPrompt } from '@/lib/novel-promotion/character-generation';
import { executeAiVisionStep } from '@/lib/ai-runtime';

// Giả lập hàm executeAiVisionStep
vi.mock('@/lib/ai-runtime', () => ({
    executeAiVisionStep: vi.fn()
}));

describe('worker: character-generation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('generates a detailed description from a character image', async () => {
        const mockResult = {
            success: true,
            text: 'A tall man with silver hair and a sharp gaze, wearing a dark trenchcoat.',
            usage: { totalTokens: 150 }
        };
        (executeAiVisionStep as any).mockResolvedValue(mockResult);

        const result = await generateCharacterDescriptionFromImage(
            ['https://example.com/test.jpg'],
            { user: { id: 'user-123' } }
        );

        expect(executeAiVisionStep).toHaveBeenCalledWith(expect.objectContaining({
            userId: 'user-123',
            imageUrls: ['https://example.com/test.jpg'],
            action: 'CharacterImageToDescription'
        }));
        expect(result.description).toBe(mockResult.text);
    });

    it('builds a valid character reference sheet prompt', () => {
        const result = buildCharacterReferenceSheetPrompt(
            'Created in a lab to fight aliens.',
            'Cyberpunk anime style',
            'John Doe'
        );

        expect(result).toContain('Cyberpunk anime style');
        expect(result).toContain('John Doe');
        expect(result).toContain('Created in a lab');
    });
});
