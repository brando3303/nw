import express from "express";
import postgres from "postgres";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
app.use(bodyParser.json());
app.get('/', async (req, res) => {
    res.status(200).send("hi client!");
});
app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = app;

