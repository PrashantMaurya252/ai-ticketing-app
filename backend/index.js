import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import ticketRoutes from './routes/ticket.js'
import {server} from "inngest/express"
import { inngest } from "./ingest/client.js";
import { onUserSignUp } from "./ingest/functions/on-signup.js";
import { onTicketCreated } from "./ingest/functions/on-ticket-create.js";
dotenv.config()
const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use("/api/inngest",server({
    client:inngest,
    functions:[onUserSignUp,onTicketCreated]
}))


app.use("/api/auth",userRoutes)
app.use("/api/tickets",ticketRoutes)

mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("MongoDB connected")
app.listen(PORT,()=>console.log("Server at http://localhost:3000"))
}).catch((err)=>console.log("MongoDB error",err))