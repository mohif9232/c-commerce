//const { Router } = require("express");
let express = require("express");
let app = express();
let { logger } = require("../e_commerce/init/winston")
let route = require("../e_commerce/route/user")
let { categoryView } = require("../e_commerce/controller/category")
let { find_product } = require("../e_commerce/controller/product")
let { register, login } = require("../e_commerce/controller/user")
let { port } = require("./config/constant")


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

logger.error("error");

app.post("api/v1/login", login) //for login of admin
app.post("api/v1/register", register) //for login of admin

app.use("api/v1/view_product", find_product)  //getting the product

app.use("/api/v1/view_category", categoryView) //for getting the product

app.use("/api/v1/user", route);


app.listen(port, () => {
    console.log(`Connected to the server on ${port}`)
})