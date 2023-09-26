import express from 'express';
import dotenv from "dotenv";
import Connection  from './config/db.js';
import cors from "cors"
import router from './routes/authRoutes.js';

//configure env
dotenv.config();

//database config
Connection();

// rest obj

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

const app = express();
app.use(cors(corsOptions))
app.use(express.json())

// routes
app.use('/api/v1/auth',router);


app.get("/", (req,res)=>{
    res.send({
        message:"Welcome to ecommerce"
    })
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running in port ${process.env.PORT}`);
})