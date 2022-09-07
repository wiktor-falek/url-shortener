import express from "express";
import cors from "cors";
import dotenv from "dotenv"; dotenv.config();

import logger from "./logger.js";
import makeDir from "./utils/makeDir.js";
import shortenRouter from "./controllers/shortenRouter.js";


// EXPRESS INIT
const app = express();

cors({
    origin: "*",
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// STATIC ROUTES
app.use("/", express.static(makeDir("/views/static"), { extensions: ["html", "css", "js", "ico"] }));

// ROUTES
app.use(shortenRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});