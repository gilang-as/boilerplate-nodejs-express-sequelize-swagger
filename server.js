require("dotenv").config()
const express = require("express")
const cors = require('cors')
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const app_host = process.env.APP_HOST || "localhost"
const app_port = process.env.APP_PORT || 5000
const db_name = process.env.DB_NAME || "test"
const db_user = process.env.DB_USER || "root"
const db_pass = process.env.DB_PASS || null
const db_host = process.env.DB_HOST || 'localhost'
const db_port = process.env.DB_PORT || 3306
const db_dialect = process.env.DB_DIAL || "mysql"
const db_logging = JSON.parse(String(process.env.DB_LOGS || "true").toLowerCase())
const db_force = JSON.parse(String(process.env.DB_FORCE || "false").toLowerCase())

const sequelize = new Sequelize(db_name, db_user, db_pass, {host: db_host, port:db_port, dialect: db_dialect, logging: db_logging})

const app = express()
const basename = path.basename(__filename)

const db = {}
fs.readdirSync(`${__dirname}/src/models`).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach(file => {
    const model = require(path.join(`${__dirname}/src/models`, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
})

db.sequelize = sequelize
db.Sequelize = Sequelize

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
});


const HandlerInit = (dir) => {
    const routes = express.Router()
    let apis = []
    fs.readdirSync(`${__dirname}/src/${dir}`).filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    }).forEach(file => {
        require(path.join(`${__dirname}/src/${dir}`, file))(routes, db.sequelize)
        apis.push(`./src/${dir}/${file}`)
    })
    return {routes, apis}
}

const {routes:routes_v1, apis:apis_v1} = HandlerInit("handlers")

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.use(cors())

app.use("/api/v1", routes_v1)

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ message: "You are not authorized." })
    } else {
        next(err);
    }
})

const swagger_option = {
    swaggerDefinition:{
        info:{
            title:"Simple NodeJS-RestAPI Boilerplate with ORM, API Docs, Docker",
            description:"Simple Rest API with nodejs, express, sequelize (orm), swagger (API Docs), Docker",
            version:"0.0.1",
            termsOfService: "http://swagger.io/terms/",
            contact: {
                name: "Gilang Adi S",
                email: "gilang@muriacode.com"
            },
            license:{
                name:"GPL-3.0 License",
                url:"https://github.com/gilang-as/boilerplate-nodejs-express-sequelize-swagger/blob/main/LICENSE"
            }
        },
        host: app_host+":"+app_port,
        basePath: "/api/v1",
        tags:[{
            name:"Public",
            description:"Public API"
        },{
            name:"Private",
            description:"Private API"
        }],
        securityDefinitions: {
            ["x-user-id"]: {
                type: 'apiKey',
                in: 'x-user-id UserID',
                name: 'x-user-id',
            }
        },
    },
    apis: apis_v1,
    security: [{
        ["x-user-id"]: []
    }]
}

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swagger_option)))

app.listen(app_port, async () =>{
    try {
        await db.sequelize.sync({
            force: db_force
        });
        await db.sequelize.authenticate()
        console.info(`Service Success Started on ${app_port}`)
    }catch (e) {
        console.log(e)
    }
});