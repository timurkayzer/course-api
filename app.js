import express from 'express';
import { router as userRouter } from './users/users.js';
const host = '127.0.0.1';
const port = 4200;

const app = express();

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

app.get('/hello', (req, res) => {
    throw new Error(500);
});

app.use('/users', userRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).end();
    next();
})



app.listen(port, () => {
    console.log('App launched');
});
