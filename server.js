const express = require('express')
const connectDB = require('./config/db')
var cors = require('cors')

const app = express()

app.use(cors())

//DB Connecttion
connectDB()

app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API Running'))

//ROUTES
app.use('/api/user', require('./routes/api/user'))
app.use('/api/booking', require('./routes/api/booking'))
app.use('/api/roles', require('./routes/api/roles'))
app.use('/api/rooms', require('./routes/api/rooms'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/burger', require('./routes/api/burger'))

const PORT = process.env.PORT || 5000

const corsOpts = {
  origin: '*',

  methods: ['GET', 'POST'],

  allowedHeaders: ['Content-Type'],
}
app.use(cors(corsOpts))
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
