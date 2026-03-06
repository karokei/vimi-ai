import { PgBoss, SendOptions, Job } from 'pg-boss';

let boss: PgBoss | null = null;

export async function getBoss() {
    if (boss) return boss;

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is not set for pg-boss');
    }

    boss = new PgBoss(connectionString);

    boss.on('error', error => console.error('pg-boss error:', error));

    await boss.start();
    return boss;
}

export async function sendTask(queue: string, data: object, options?: SendOptions) {
    const b = await getBoss();
    return await b.send(queue, data, options);
}

/**
 * Lắng nghe và xử lý task từ queue
 */
export async function startWorker(queue: string, handler: (job: Job<any>) => Promise<void>) {
    const b = await getBoss();
    await b.work(queue, async (jobs) => {
        for (const job of jobs) {
            try {
                console.log(`[pg-boss] Processing job ${job.id} from queue ${queue}`);
                await handler(job);
            } catch (error) {
                console.error(`[pg-boss] Error processing job ${job.id}:`, error);
                throw error; // pg-boss will handle retry
            }
        }
    });
}
