const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); 
app.use(express.json());

const authrouter = require("./Routes/routes");

app.use("/api", authrouter);

const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});