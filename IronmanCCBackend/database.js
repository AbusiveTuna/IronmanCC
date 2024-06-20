import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'test',
    host: 'localhost',
    database: 'ironmancc',
    password: 'test',
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

const getLatestResults = async (competitionId) => {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT results FROM competition_results WHERE competition_id = $1`,
            [competitionId]
        );
        return res.rows[0] ? res.rows[0].results : null;
    } finally {
        client.release();
    }
};

export { createTable, saveResults, getLatestResults };
