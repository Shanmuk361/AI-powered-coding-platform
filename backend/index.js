const express=require('express');
const app=express();

app.get('/api/runcode',(req,res)=>{
    res.send("hello")
})
app.listen(3000,()=>{
    console.log('server running on port 3000');
})