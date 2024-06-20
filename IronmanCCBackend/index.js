import express from 'express';
import axios from 'axios';
import { templeMap } from './resources/2024_templeMap.js';
import { createTable, saveResults, getLatestResults  } from './database.js';

const app = express();
const port = 3000;

let templeSkills = [];
let isFetching = false;

const getTempleSkills = () => {
    templeSkills = templeMap.map(row => row[row.length - 1]);
};

const fetchCompetitionInfo = async (compId) => {
    if (isFetching) {
        console.log("Fetch operation already in progress...");
        return;
    }
    isFetching = true; 

    let results = {};
    for (const skill of templeSkills) {
        try {
            const response = await axios.get(`https://templeosrs.com/api/competition_info.php?id=${compId}&skill=${skill}`);
            const data = response.data.data;

            const skillIndex = data.info.skill_index;
            if (!results[skillIndex]) {
                results[skillIndex] = {};
            }

            data.participants.forEach(participant => {
                const teamName = participant.team_name;
                const xpGained = participant.xp_gained;

                if (!results[skillIndex][teamName]) {
                    results[skillIndex][teamName] = 0;
                }

                results[skillIndex][teamName] += xpGained;
            });

        } catch (error) {
            console.error(`Error fetching data for skill ${skill}:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // TempleOSRS rate limits so request every 10s
    }

    console.log('Aggregated results:', results);
    await saveResults(compId, results);
    isFetching = false;
};

const updateSingleSkill = async (compId, skillIndex) => {
    try {
        const response = await axios.get(`https://templeosrs.com/api/competition_info.php?id=${compId}&skill=${skillIndex}`);
        const data = response.data.data;

        const latestResults = await getLatestResults(compId) || {};
        if (!latestResults[skillIndex]) {
            latestResults[skillIndex] = {};
        }

        data.participants.forEach(participant => {
            const teamName = participant.team_name;
            const xpGained = participant.xp_gained;

            if (!latestResults[skillIndex][teamName]) {
                latestResults[skillIndex][teamName] = 0;
            }

            latestResults[skillIndex][teamName] += xpGained;
        });

        console.log(`Updated results for skill ${skillIndex}:`, latestResults);
        await saveResults(compId, latestResults);
    } catch (error) {
        console.error(`Error fetching data for skill ${skillIndex}:`, error);
    }
};

app.get('/results/:compId', async (req, res) => {
    const compId = parseInt(req.params.compId, 10);
    const latestResults = await getLatestResults(compId);
    if (latestResults) {
        res.json(latestResults);
    } else {
        res.status(404).send('Results not found');
    }
});

app.get('/update-skill/:compId/:skillIndex', async (req, res) => {
    const compId = parseInt(req.params.compId, 10);
    const skillIndex = parseInt(req.params.skillIndex, 10);
    await updateSingleSkill(compId, skillIndex);
    const updatedResults = await getLatestResults(compId);
    if (updatedResults) {
        res.json(updatedResults);
    } else {
        res.status(404).send('Results not found');
    }
});

app.listen(port, async () => {
    await createTable();
    getTempleSkills();
    fetchCompetitionInfo(15025);
    console.log(`Server is running at http://localhost:${port}`);
    setInterval(() => {
        fetchCompetitionInfo(15025);
    }, 3600000);
});
