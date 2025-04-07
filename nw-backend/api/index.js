const express = require("express");
const postgres = require("postgres");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require("cors")

const port = 3001;
const app = express();

app.use(cors({
    origin: '*' // or use '*' to allow all origins
}));
  
app.use(bodyParser.json());
app.get('/playerList', routes.getPlayerList);
app.get('/player', routes.getPlayer);
app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = app;

