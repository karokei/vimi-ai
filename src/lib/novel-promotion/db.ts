import { createClient } from '@/lib/supabase/server';

export const NovelPromotionDB = {
    /**
     * Lưu danh sách nhân vật mới vào database
     */
    async saveCharacters(projectId: string, characters: any[]) {
        const supabase = await createClient();

        const insertData = characters.map(char => ({
            novel_promotion_project_id: projectId,
            name: char.name,
            aliases: char.aliases ? JSON.stringify(char.aliases) : null,
            introduction: char.introduction,
            profile_data: char.profile_data ? JSON.stringify(char.profile_data) : null,
            profile_confirmed: false
        }));

        const { data, error } = await supabase
            .from('novel_promotion_characters')
            .insert(insertData)
            .select();

        if (error) throw error;
        return data;
    },

    /**
     * Lưu danh sách tập phim (episodes)
     */
    async saveEpisodes(projectId: string, episodes: any[]) {
        const supabase = await createClient();

        const insertData = episodes.map(ep => ({
            novel_promotion_project_id: projectId,
            number: ep.number,
            title: ep.title,
            summary: ep.summary,
            content: ep.content,
            estimated_words: ep.estimatedWords
        }));

        const { data, error } = await supabase
            .from('novel_promotion_episodes')
            .upsert(insertData, { onConflict: 'novel_promotion_project_id,number' })
            .select();

        if (error) throw error;
        return data;
    },

    /**
     * Lưu storyboard panels cho một clip
     */
    async saveStoryboardPanels(clipId: string, panels: any[]) {
        const supabase = await createClient();

        // Cần clipId (UUID) từ database, không phải string ID từ AI
        // Phụ thuộc vào cách map clip_id sang database ID

        const insertData = panels.map(panel => ({
            clip_id: clipId,
            panel_number: panel.panel_number,
            description: panel.description,
            characters: JSON.stringify(panel.characters),
            location: panel.location,
            source_text: panel.source_text,
            shot_type: panel.shot_type,
            camera_move: panel.camera_move,
            video_prompt: panel.video_prompt,
            photography_plan: panel.photographyPlan ? JSON.stringify(panel.photographyPlan) : null,
            acting_notes: panel.actingNotes ? JSON.stringify(panel.actingNotes) : null
        }));

        const { data, error } = await supabase
            .from('novel_promotion_panels')
            .insert(insertData)
            .select();

        if (error) throw error;
        return data;
    }
};
