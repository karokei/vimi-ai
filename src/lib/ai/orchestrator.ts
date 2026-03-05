import { createClient } from '@/lib/supabase/server';
import { generateImage } from './gemini';

export type TaskType = 'image-gen' | 'video-gen' | 'tts' | 'text-analysis';
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface CreateTaskParams {
    projectId: string;
    type: TaskType;
    payload: Record<string, unknown>;
}

/**
 * AI Orchestrator: Quản lý các tác vụ AI chạy ngầm.
 * Giúp tách biệt logic gọi AI và giao diện người dùng.
 */
export const AIOrchestrator = {
    /**
     * Tạo một task mới trong database
     */
    async createTask({ projectId, type, payload }: CreateTaskParams) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Unauthorized');

        const { data, error } = await supabase
            .from('ai_tasks')
            .insert({
                user_id: user.id,
                project_id: projectId,
                type,
                status: 'pending',
                payload,
                progress: 0
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Cập nhật trạng thái và tiến độ của task
     */
    async updateTask(taskId: string, updates: {
        status?: TaskStatus;
        progress?: number;
        message?: string;
        result?: unknown;
        error?: string;
    }) {
        const supabase = await createClient();
        const { error } = await supabase
            .from('ai_tasks')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
                ...(updates.status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
                ...(updates.status === 'processing' && !updates.progress ? { started_at: new Date().toISOString() } : {})
            })
            .eq('id', taskId);

        if (error) console.error(`Error updating task ${taskId}:`, error);
    },

    /**
     * Logic sinh ảnh cho Panel (Stage 5)
     * Sử dụng Nano Banana 2 (Gemini 3.1 Flash Image Preview)
     */
    async runImageGen(taskId: string, panelId: string): Promise<void> {
        try {
            const supabase = await createClient();
            await this.updateTask(taskId, { status: 'processing', progress: 10, message: 'Đang chuẩn bị prompt...' });

            const { data: panel, error: panelError } = await supabase
                .from('panels')
                .select('image_prompt, clip_id')
                .eq('id', panelId)
                .single();

            if (panelError || !panel) throw new Error('Panel not found');

            await this.updateTask(taskId, { progress: 30, message: 'Nano Banana 2 đang vẽ...' });

            // 1. Generate Image (Base64)
            const base64Data = await generateImage(panel.image_prompt);

            await this.updateTask(taskId, { progress: 70, message: 'Đang lưu ảnh lên đám mây...' });

            // 2. Convert base64 to Buffer
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `${panelId}_${Date.now()}.png`;
            const filePath = `ai-gen/images/${fileName}`;

            // 3. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, buffer, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // 4. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            // 5. Update Panel
            await supabase
                .from('panels')
                .update({ image_url: publicUrl, status: 'completed' })
                .eq('id', panelId);

            await this.updateTask(taskId, {
                status: 'completed',
                progress: 100,
                message: 'Sinh ảnh thành công!',
                result: { image_url: publicUrl }
            });

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('runImageGen Error:', error);
            await this.updateTask(taskId, { status: 'failed', error: message });
        }
    },

    /**
     * Logic sinh storyboard panels
     */
    async runStoryboardGen() {
        // (This will eventually use the proper logic from the route but backgrounded)
        // I'll keep the logic here consistent with the route but for now it's a placeholder
    }
};

