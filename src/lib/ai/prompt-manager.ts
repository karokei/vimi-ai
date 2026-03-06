import prompts from './prompts.json';

type PromptId = keyof typeof prompts;

export const PROMPT_IDS = Object.keys(prompts).reduce((acc, key) => {
    acc[key as PromptId] = key as PromptId;
    return acc;
}, {} as Record<PromptId, PromptId>);

/**
 * Prompt Manager: Quản lý và xây dựng các câu lệnh (prompts) cho AI.
 */
export const PromptManager = {
    /**
     * Lấy template của một prompt dựa trên ID
     */
    getTemplate(promptId: PromptId): string {
        const template = (prompts as any)[promptId];
        if (!template) {
            throw new Error(`Prompt ID not found: ${promptId}`);
        }
        return template;
    },

    /**
     * Thay thế các biến trong template bằng giá trị thực tế
     */
    buildPrompt(promptId: PromptId, variables: Record<string, string | number | null | undefined>): string {
        let rendered = this.getTemplate(promptId);

        // Hỗ trợ cả {variable} và {{variable}}
        Object.entries(variables).forEach(([key, value]) => {
            const strValue = value === null || value === undefined ? '' : String(value);
            const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`\\{\\{${escaped}\\}\\}|\\{${escaped}\\}`, 'g');
            rendered = rendered.replace(pattern, strValue);
        });

        return rendered;
    }
};
