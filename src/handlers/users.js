module.exports = (routes, db) => {
    routes.get("/user", async (req, res) => {
        res.status(200).send({
            message: "User"
        })
    })
}