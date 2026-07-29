import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from 'node:dns'
import wishesRouter from './routes/wishes.js'

dotenv.config()

// See seed.js for why — fixes "querySrv ECONNREFUSED" on some networks.
dns.setServers(['8.8.8.8', '8.8.4.4'])

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/wishes', wishesRouter)

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
