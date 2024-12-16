const express = require('express');
const cors = require('cors'); // Import cors

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.post('/api/runcode', async (req, res) => {
    const { script } = req.body;

    if (!script || typeof script !== 'string') {
        return res.status(400).json({ success: false, error: "'script' is required and should be a valid string." });
    }

    const requestData = {
        clientId: "98f3dea44343f343f4b8bcfa2dafd63a",
        clientSecret: "9f10f70ac88318b617258bfde56a1f2e58ec20dec9f96e2b6bc3546eebf9ece8",
        script, // Pass the user's code from the request
        language: "python3", // Default to Python
        compileOnly: false,
    };

    try {
        const response = await fetch("https://api.jdoodle.com/v1/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`JDoodle API error: ${errorText}`);
        }

        const data = await response.json();
        if (data.output) {
            res.status(200).json({ success: true, output: data.output });
        } else {
            res.status(200).json({ success: false, error: data.error || data.exception });
        }
    } catch (error) {
        console.error("Error while executing code:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server Running on port 3000");
});
