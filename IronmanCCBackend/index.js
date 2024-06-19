import express from 'express';
import axios from 'axios';
import { templeMap } from './resources/2024_templeMap.js';
import { createTable, saveResults } from './database.js';

const app = express();
const port = 3000;

let templeSkills = [];
let results = {};

const getTempleSkills = () => {
    templeSkills = templeMap.map(row => row[row.length - 1]);
};

const fetchCompetitionInfo = async (compId) => {
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
        await new Promise(resolve => setTimeout(resolve, 10000)); //TempleOSRS rate limits so request every 10s 
    }

    console.log('Aggregated results:', results);
    await saveResults(compId, results);
};

app.listen(port, () => {
    getTempleSkills();
    fetchCompetitionInfo(15025);
});
