import { executeAiVisionStep } from '@/lib/ai-runtime';
import prompts from '@/lib/ai/prompts.json';
import { getModelForCapability } from '@/lib/ai/gemini';

/**
 * Phân tích ảnh tham khảo và tạo ra mô tả chi tiết cho nhân vật (bằng tiếng Anh).
 * Tính năng này hỗ trợ cho việc tạo ảnh mới nhất quán với nhân vật gốc.
 */
export async function generateCharacterDescriptionFromImage(
    imageUrls: string[],
    session?: any,
    projectId?: string,
    projectName?: string,
    locale: string = 'en'
): Promise<{ success: boolean; description?: string; error?: string }> {
    try {
        const promptTemplate = prompts.NP_CHARACTER_IMAGE_TO_DESCRIPTION;
        const model = getModelForCapability('text-analysis'); // For Vision in Gemini, models.vision might be needed actually
        // the client fallback uses MODELS.VISION directly, but let's pass it anyway.

        const result = await executeAiVisionStep({
            userId: session?.user?.id || 'system',
            model: 'gemini-3.1-flash-preview', // Hardcode for now
            prompt: promptTemplate,
            imageUrls: imageUrls,
            projectId: projectId,
            action: 'CharacterImageToDescription',
            temperature: 0.3,
        });

        return {
            success: true,
            description: result.text
        };
    } catch (error: any) {
        console.error('[Character Generation] Error extracting description from image:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Trả về Prompt đã được tối ưu để tạo ảnh Character Sheet (3 mặt) từ ảnh tham khảo.
 * Người dùng có thể truyền thêm customDescription để tuỳ chỉnh nội dung mô tả.
 */
export function buildCharacterReferenceSheetPrompt(
    customDescription?: string,
    artStylePrompt?: string,
    characterName?: string
): string {
    const basePrompt = customDescription || prompts.NP_CHARACTER_REFERENCE_TO_SHEET;

    let finalPrompt = `${characterName || 'Character'}, character design sheet, front view, side view, back view. ${basePrompt}`;

    if (artStylePrompt) {
        finalPrompt += `, ${artStylePrompt}`;
    }

    return finalPrompt;
}
