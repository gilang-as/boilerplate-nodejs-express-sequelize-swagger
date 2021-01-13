module.exports = (routes, db) => {
    routes.get("/todo", async (req, res) => {
        res.status(200).send({
            message: "Todo"
        })
    })
}