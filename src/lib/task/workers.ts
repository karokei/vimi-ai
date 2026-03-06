import { startWorker } from './pg-boss';
import { AIOrchestrator } from '@/lib/ai/orchestrator';
import { executeStoryToScript } from '@/lib/novel-promotion/story-to-script/orchestrator';
import { executeScriptToStoryboard } from '@/lib/novel-promotion/script-to-storyboard/orchestrator';

/**
 * Khởi tạo các workers để xử lý task chạy ngầm
 */
export async function initializeWorkers() {
    console.log('[Workers] Initializing AI task workers...');

    // 1. Worker xử lý Novel Promotion: Story to Script
    await startWorker('novel-story-to-script', async (job) => {
        const { taskId, projectId, episodeId, content, characters, locations, novelPromotionData, session, locale } = job.data;

        try {
            await AIOrchestrator.updateTask(taskId, { status: 'processing', progress: 5, message: 'Đang chuyển đổi tiểu thuyết sang kịch bản...' });

            const result = await executeStoryToScript(
                content,
                characters,
                locations,
                novelPromotionData,
                session,
                projectId,
                'Novel Project', // Placeholder name
                locale,
                taskId
            );

            await AIOrchestrator.updateTask(taskId, {
                status: 'completed',
                progress: 100,
                message: 'Chuyển đổi kịch bản thành công!',
                result
            });
        } catch (error: any) {
            console.error('[Worker] StoryToScript Error:', error);
            await AIOrchestrator.updateTask(taskId, { status: 'failed', error: error.message });
            throw error;
        }
    });

    // 2. Worker xử lý Novel Promotion: Script to Storyboard
    await startWorker('novel-script-to-storyboard', async (job) => {
        const { taskId, projectId, clipIds, novelPromotionData, session, locale } = job.data;

        try {
            await AIOrchestrator.updateTask(taskId, { status: 'processing', progress: 5, message: 'Đang lập kế hoạch phân cảnh...' });

            const result = await executeScriptToStoryboard(
                clipIds,
                novelPromotionData,
                session,
                projectId,
                'Novel Project',
                locale,
                taskId
            );

            await AIOrchestrator.updateTask(taskId, {
                status: 'completed',
                progress: 100,
                message: 'Lập kế hoạch phân cảnh thành công!',
                result
            });
        } catch (error: any) {
            console.error('[Worker] ScriptToStoryboard Error:', error);
            await AIOrchestrator.updateTask(taskId, { status: 'failed', error: error.message });
            throw error;
        }
    });

    // 3. Worker xử lý Novel Promotion: Analysis (Episode Split + Character Profile)
    await startWorker('novel-analysis', async (job) => {
        const { taskId, projectId, content, charactersLibInfo, session, locale } = job.data;
        const { NovelPromotionDB } = await import('@/lib/novel-promotion/db');
        const { executeEpisodeSplit } = await import('@/lib/novel-promotion/episode-split');
        const { executeCharacterProfile } = await import('@/lib/novel-promotion/character-profile');

        try {
            // Bước 3.1: Phân tập
            await AIOrchestrator.updateTask(taskId, { status: 'processing', progress: 10, message: 'Đang phân tích và chia tập tiểu thuyết...' });
            const splitResult = await executeEpisodeSplit(content, session, projectId, 'Novel Project', locale);
            await NovelPromotionDB.saveEpisodes(projectId, splitResult.episodes);

            // Bước 3.2: Trích xuất nhân vật
            await AIOrchestrator.updateTask(taskId, { status: 'processing', progress: 50, message: 'Đang trích xuất thông tin nhân vật...' });
            const charResult = await executeCharacterProfile(content, charactersLibInfo, session, projectId, 'Novel Project', locale);
            if (charResult.new_characters) {
                await NovelPromotionDB.saveCharacters(projectId, charResult.new_characters);
            }

            await AIOrchestrator.updateTask(taskId, {
                status: 'completed',
                progress: 100,
                message: 'Phân tích tổng thể hoàn tất!',
                result: { episodes: splitResult.episodes.length, characters: charResult.new_characters?.length || 0 }
            });
        } catch (error: any) {
            console.error('[Worker] NovelAnalysis Error:', error);
            await AIOrchestrator.updateTask(taskId, { status: 'failed', error: error.message });
            throw error;
        }
    });

    console.log('[Workers] All workers started.');
}
