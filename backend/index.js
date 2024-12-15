const express=require('express');
const app=express();

app.get('/api/runcode', async (req,res)=>{

    const reqdata=req.body;
    try {
        const requestData = {
          clientId: "98f3dea44343f343f4b8bcfa2dafd63a",
          clientSecret: "9f10f70ac88318b617258bfde56a1f2e58ec20dec9f96e2b6bc3546eebf9ece8",
          script: code, // Replace with your Python code string
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
      
        // Check if execution was successful
        if (data.output) {
          console.log("Output:", data.output);
        } else {
          console.error("Error/Exception:", data.error || data.exception);
        }
      } catch (error) {
        console.error("Error while executing code:", error);
      }
})
app.listen(3000,()=>{
    console.log('server running on port 3000');
})