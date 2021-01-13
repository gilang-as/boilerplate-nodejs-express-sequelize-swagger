require("dotenv").config()
const express = require("express")
const cors = require('cors')

const SequelizeInit = require("./models")

const { sequelize } = SequelizeInit({
    db_name: process.env.DB_NAME || "test",
    db_user: process.env.DB_USER || "root",
    db_pass: process.env.DB_PASS || "",
    db_host: process.env.DB_HOST || 'localhost',
    db_port: process.env.DB_PORT || 3306,
    db_dialect: process.env.DB_DIAL || "mysql",
    db_logging: process.env.DB_LOGS || true
})

const app = express()
const route = express.Router()

const port = process.env.APP_PORT || 5000

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.use(cors())

app.use("/api/v1", route);

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ message: "You are not authorized." });
    } else {
        next(err);
    }
});

app.listen(port, async () =>{
    try {
        await sequelize.sync({
            force: process.env.DB_FORCE || false
        });
        await sequelize.authenticate();
        console.info(`Service Success Started on ${port}`)
    }catch (e) {
        console.log(e)
    }
});