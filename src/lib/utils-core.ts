// === Logging Utils ===
export function createScopedLogger(meta: { module: string }) {
    return {
        info: (message: string, details?: any) => console.log(`[INFO][${meta.module}] ${message}`, details || ''),
        error: (data: { action: string; message: string; errorCode?: string; retryable?: boolean; details?: any; error?: any }) =>
            console.error(`[ERROR][${meta.module}][${data.action}] ${data.message}`, data),
        warn: (message: string, details?: any) => console.warn(`[WARN][${meta.module}] ${message}`, details || ''),
    };
}

// === Error Utils ===
export function normalizeAnyError(error: any, meta?: { context: string }) {
    const message = error instanceof Error ? error.message : String(error);
    return {
        message,
        code: (error as any)?.code || 'INTERNAL_ERROR',
        retryable: (error as any)?.retryable ?? true,
        stack: error instanceof Error ? error.stack : undefined,
    };
}

/**
 * Tính số từ (Word count)
 * Tiếng Trung: mỗi Hán tự = 1 từ
 * Tiếng Anh: mỗi từ (cách nhau bởi khoảng trắng) = 1 từ
 */
export function countWords(text: string): number {
    if (!text) return 0;

    // Đếm từ tiếng Anh/số
    let englishWordCount = 0;
    const textWithoutEnglish = text.replace(/[a-zA-Z0-9]+/g, () => {
        englishWordCount++;
        return '';
    });

    // Đếm ký tự tiếng Trung
    const chineseMatches = textWithoutEnglish.match(/[\u4e00-\u9fa5\u3400-\u4dbf\u20000-\u2a6df]/g);
    const chineseCount = chineseMatches ? chineseMatches.length : 0;

    return englishWordCount + chineseCount;
}
