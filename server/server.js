const express = require('express');
const cookieParser = require('cookie-parser');

const RouteUser = require('./src/routes/RouteUser');
const RouteLogin = require('./src/routes/LoginRoute');

const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORTA = process.env.PORTA;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // front-end
  credentials: true
}));
app.use(cookieParser());

app.use('/api',RouteUser);
app.use('/api',RouteLogin);


app.listen(PORTA,()=>{
    console.log(`Server rodando na porta ${PORTA}`);
});