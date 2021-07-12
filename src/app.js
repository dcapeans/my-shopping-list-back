import express from "express";
import cors from "cors";

import connection from "./database.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/new-item", async (req, res) => {
    try {
        const { text } = req.body
        await connection.query(`
            INSERT INTO items (name)
            VALUES ($1)
        `, [text])

        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.get("/list", async (req, res) => {
    try {
        const list = await connection.query(`
            SELECT * from items
        `)

        res.status(200).send(list.rows)
    } catch (error) {
        res.sendStatus(500)
    }
})

export default app;
