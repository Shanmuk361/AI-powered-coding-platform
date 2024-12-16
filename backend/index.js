const express=require('express');
const app=express();

app.get('/api/runcode', async (req, res) => {
    const reqdata = req.body;

    try {
        const requestData = {
            clientId: "98f3dea44343f343f4b8bcfa2dafd63a",
            clientSecret: "9f10f70ac88318b617258bfde56a1f2e58ec20dec9f96e2b6bc3546eebf9ece8",
            script: reqdata.code, // Use `reqdata.code` to get the code from the client
            language: "python",
            versionIndex: "3", // Ensure you use the correct version index for Python
            compileOnly: false,
        };

        const response = await fetch("https://api.jdoodle.com/v1/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Correctly parse the JSON response
        console.log("Execution Response:", data);

        if (data.output) {
            // Send the output back to the client
            res.status(200).json({ success: true, output: data.output });
        } else {
            // Send the error/exception back to the client
            res.status(200).json({ success: false, error: data.error || data.exception });
        }
    } catch (error) {
        console.error("Error while executing code:", error);
        // Send error details back to the client
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000,()=>
{console.log("Server Running on port 3000")})