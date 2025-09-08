const express = require('express');

const RouteUser = require('./src/routes/RouteUser')
const RouteLogin = require('./src/routes/LoginRoute')

const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();
const PORTA = process.env.PORTA;

app.use(express.json());
app.use(cors())


app.use('/api',RouteUser)
app.use('/api',RouteLogin)


app.listen(PORTA,()=>{
    console.log(`Server rodando na porta ${PORTA}`);
});