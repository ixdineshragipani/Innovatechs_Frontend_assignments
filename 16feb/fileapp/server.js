const express=require('express');
const cors=require('cors');
const fs=require('fs');
const path=require('path');

const app=express();
app.use(cors());
app.use(express.json());

const filePath=path.join(__dirname,'src','treequestions.txt');

app.post('/append',(req,res)=>{
    const {name,age}=req.body;
    if(!name ||!age){
        return res.status(400).send("Name and age required");
    }
    
    const line=`${name} ${age}\n`;
    fs.appendFile(filePath,line,(err)=>{
        if(err){
            console.error("Failed to write",err);
            return res.status(500).send("Failed to append");
        }
        else{
            res.send("ok");
        }
    });
});
app.listen(3000,()=>{
    console.log("Express server is listening on port 3000");
});