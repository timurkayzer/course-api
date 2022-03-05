import express, { Router } from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
    res.send('Logged in');
})

router.post('/register', (req, res) => {
    res.send('Registered');
})

export { router };