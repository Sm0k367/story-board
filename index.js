// index.js - StoryBoard API with Groq integration
const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

// Config
const PORT = process.env.PORT || 8080;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Friendly root for browser check
app.get('/', (req, res) => {
res.send('🎬 StoryBoard API is running! POST to /storyboard or /video.');
});

// POST /storyboard : Accept prompt, call Groq API (LLM), fallback to Python stub
app.post('/storyboard', async (req, res) => {
const prompt = req.body.prompt;
if (!prompt) return res.status(400).json({ error: 'Prompt required.' });

if (!GROQ_API_KEY) {
// Fallback if no API key set
return res.status(500).json({ error: 'Groq API key not set. Set GROQ_API_KEY env variable.' });
}

try {
// Example: LLM completion (edit endpoint/path/model as needed for Groq's current API)
const groqResponse = await axios.post(
'https://api.groq.com/openai/v1/chat/completions',
{
model: 'mixtral-8x7b-32768', // Or your desired Groq model
messages: [{ role: 'user', content: prompt }],
max_tokens: 256,
},
{
headers: {
'Authorization': `Bearer ${GROQ_API_KEY}`,
'Content-Type': 'application/json',
},
}
);

const story = groqResponse?.data?.choices?.[0]?.message?.content ?? '<blank>';
res.json({ output: story.trim() });
} catch (err) {
// If Groq fails, optional: fall back to local Python stub.
exec(`python3 storyboard.py --prompt "${prompt.replace(/"/g, '\\"')}"`, (err2, stdout, stderr) => {
if (err2) return res.status(500).json({ error: stderr });
res.json({ output: `[Groq failed, fallback] ${stdout}` });
});
}
});

// POST /video (unchanged - still uses local python stub)
app.post('/video', (req, res) => {
const params = JSON.stringify(req.body || {});
exec(`python3 video.py --params '${params.replace(/'/g, "'\\''")}'`, (err, stdout, stderr) => {
if (err) return res.status(500).json({ error: stderr });
res.json({ output: stdout });
});
});

// Start server
app.listen(PORT, () => {
console.log(`🎬 StoryBoard API running on port ${PORT}`);
});
