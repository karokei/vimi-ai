import { type Job } from 'pg-boss';
import { generateImage } from '@/lib/ai/gemini';
import { AIOrchestrator } from '@/lib/ai/orchestrator';

/**
 * Handle storyboard panel generation
 */
export async function handlePanelImageTask(job: Job<any>) {
    const { taskId, panelId, projectId, prompt, session } = job.data;
    const { NovelPromotionDB } = await import('@/lib/novel-promotion/db');

    try {
        await AIOrchestrator.updateTask(taskId, { status: 'processing', progress: 10, message: 'Đang bắt đầu vẽ phân cảnh...' });

        // Sử dụng Gemini Flash Image Preview để tạo ảnh
        // Đối với thực tế, các model sinh ảnh có thể cần API Key riêng (VD: Banana, Fal).
        // Ở đây chúng ta port logic sang Gemini để giữ nguyên architecture.
        const base64Image = await generateImage(prompt, session?.user?.id); // or api key

        // upload base64 image to Supabase Storage
        // For now, we simulate uploading and get a URL.
        const imageUrl = `data:image/jpeg;base64,${base64Image}`; // Temporary for testing without actual storage setup

        // Update the panel in the database
        await NovelPromotionDB.updatePanelImage(panelId, imageUrl, null);

        await AIOrchestrator.updateTask(taskId, { status: 'completed', progress: 100, message: 'Phân cảnh đã được vẽ thành công!' });
    } catch (error: any) {
        console.error('[Worker] PanelImageTask Error:', error);
        await AIOrchestrator.updateTask(taskId, { status: 'failed', error: error.message });
        throw error;
    }
}

/**
 * Handle character reference sheet generation
 */
export async function handleCharacterImageTask(job: Job<any>) {
    const { taskId, appearanceId, prompt, session } = job.data;
    const { NovelPromotionDB } = await import('@/lib/novel-promotion/db');

    try {
        await AIOrchestrator.updateTask(taskId, { status: 'processing', progress: 20, message: 'Đang vẽ Character Sheet...' });

        const base64Image = await generateImage(prompt, session?.user?.id);
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;

        // Cập nhật Database
        await NovelPromotionDB.updateCharacterAppearanceImage(appearanceId, imageUrl, [imageUrl]);

        await AIOrchestrator.updateTask(taskId, { status: 'completed', progress: 100, message: 'Character Sheet đã được tạo!' });
    } catch (error: any) {
        console.error('[Worker] CharacterImageTask Error:', error);
        await AIOrchestrator.updateTask(taskId, { status: 'failed', error: error.message });
        throw error;
    }
}
