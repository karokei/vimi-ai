import { vi } from 'vitest'

// Global mock cho Supabase / pg-boss
export const supabaseMock = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    storage: {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/mock.png' } })
    },
    auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } })
    }
}

export const pgBossMock = {
    sendTask: vi.fn()
}

// Giả lập createClient của Supabase cho Server
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => supabaseMock)
}))

// Giả lập AI Orchestrator DB
vi.mock('@/lib/ai/orchestrator', () => ({
    AIOrchestrator: {
        createTask: vi.fn().mockResolvedValue({ id: 'mock-task-id' }),
        updateTask: vi.fn(),
        runNovelStoryToScript: vi.fn(),
        runNovelScriptToStoryboard: vi.fn()
    }
}))

vi.mock('@/lib/task/pg-boss', () => pgBossMock)
