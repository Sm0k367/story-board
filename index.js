// index.js - Main API orchestrator for StoryBoard
const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

// Config
const PORT = process.env.PORT || 3141;

// POST /storyboard : Accept prompt, call Python
app.post('/storyboard', (req, res) => {
const prompt = req.body.prompt;
if (!prompt) return res.status(400).json({ error: 'Prompt required.' });
exec(`python3 storyboard.py --prompt "${prompt.replace(/"/g, '\\"')}"`, (err, stdout, stderr) => {
if (err) return res.status(500).json({ error: stderr });
res.json({ output: stdout });
});
});

// POST /video : Accept params, call Python
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
