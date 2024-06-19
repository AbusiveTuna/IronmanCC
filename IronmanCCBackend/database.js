import { Pool } from 'pg';

const pool = new Pool({
    user: 'your_username',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

const createTable = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS competition_results (
                competition_id INTEGER PRIMARY KEY,
                results JSONB NOT NULL
            )
        `);
    } finally {
        client.release();
    }
};

const saveResults = async (competitionId, results) => {
    const client = await pool.connect();
    try {
        await client.query(
            `INSERT INTO competition_results (competition_id, results)
             VALUES ($1, $2)
             ON CONFLICT (competition_id)
             DO UPDATE SET results = EXCLUDED.results`,
            [competitionId, results]
        );
    } finally {
        client.release();
    }
};

export { createTable, saveResults };
