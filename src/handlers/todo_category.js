module.exports = (routes, db) => {
    routes.get("/todo-category", async (req, res) => {
        res.status(200).send({
            message: "Todo Category"
        })
    })
}