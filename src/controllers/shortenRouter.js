import { Router } from "express";
import { createClient } from 'redis';
import { URL } from "url";
import dotenv from "dotenv"; dotenv.config();

import logger from "../logger.js";
import { validationResult, param, body } from "express-validator";


// redis store with keys free for use
const clientFree = createClient({
    host: 'apdo',
    port: 9000
    //password: process.env.REDIS_PASS
});
clientFree.on('error', err => {
    console.log('Error ' + err);
});
await clientFree.connect();

// redis store with keys that have urls 
const clientTaken = createClient({
    host: 'apdo',
    port: 9001
    //password: process.env.REDIS_PASS
});
clientTaken.on('error', err => {
    console.log('Error ' + err);
});
await clientTaken.connect();

const router = Router();

router.post("/", 
    body('url').isURL(),
    async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        console.log(validationResult(req).mapped())
        return res.status(400).json({ error: "invalid url" });
    }

    const { url } = req.body;

    // get random free key
    const token = await clientFree.randomKey();

    const ok = await clientTaken.set(token, url);
    if (!ok) {
        res.json({ error: "failed to assign url" });
    }

    res.json({ token });
})

router.get("/:token", 
    param("token").isLength({ min: 4, max: 4 }).isAlphanumeric(),
    async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ error: "invalid token" });
    }

    const { token } = req.params;
    const url = await clientTaken.get(token);
    if (url === null || url === "0") {
        return res.redirect('/notfound');
    }

    res.redirect(url);
})


export default router;