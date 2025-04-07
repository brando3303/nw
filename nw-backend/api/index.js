const express = require("express");
const postgres = require("postgres");
const bodyParser = require("body-parser");
const routes = require("./routes");

const port = 3000;
const app = express();
const cors = require('cors');
    
// const allowedOrigins = ['https://nsf-nateleland.vercel.app'];
// const corsOptions = {
//     origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) { //also allow requests made directly to the server
//         callback(null, true);
//     } else {
//         callback(new Error('Not allowed by CORS'));
//     }
//     },
// };
// app.use(cors(corsOptions));
    



app.use(bodyParser.json());
app.get('/playerList', routes.getPlayerList);
app.get('/player', routes.getPlayer);
app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = app;

