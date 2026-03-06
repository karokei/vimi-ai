export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { initializeWorkers } = await import('@/lib/task/workers');
        await initializeWorkers();
    }
}
