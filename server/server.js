const express = require('express');
const cookieParser = require('cookie-parser');

const UserRoute = require('./src/routes/UserRoute');
const AuthRoute = require('./src/routes/AuthRoute');
const FretebrasRoute = require('./src/routes/FretebrasRoute');

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

app.use('/api',UserRoute);
app.use('/api',AuthRoute);
app.use('/api/fretebras',FretebrasRoute);


app.listen(PORTA,()=>{
    console.log(`Server rodando na porta ${PORTA}`);
});