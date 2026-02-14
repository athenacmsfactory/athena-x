// GET ALL ACTIVE SITE SERVERS (detect via ps and fuser)
app.get('/api/servers/active', (req, res) => {
    try {
        const portRegistry = JSON.parse(fs.readFileSync(path.join(root, 'config/site-ports.json'), 'utf8'));
        const activeServers = [];

        for (const [siteName, port] of Object.entries(portRegistry)) {
            try {
                const result = execSync(`fuser ${port}/tcp 2>/dev/null || true`).toString().trim();
                if (result) {
                    const pid = result.split(/\s+/)[0];
                    activeServers.push({
                        siteName,
                        port,
                        pid,
                        url: `http://localhost:${port}/${siteName}/`
                    });
                }
            } catch (e) { }
        }

        res.json({ servers: activeServers });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// STOP A SPECIFIC SERVER BY PORT
app.post('/api/servers/stop/:port', (req, res) => {
    const { port } = req.params;
    try {
        execSync(`fuser -k ${port}/tcp 2>/dev/null || true`);
        res.json({ success: true, message: `Server on port ${port} stopped` });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
