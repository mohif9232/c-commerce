let { Order } = require("../schema/order")
let joi = require("joi")
let { Product, Op } = require("../schema/product")
const { sequelize, QueryTypes } = require("../init/dbconnect")
const { error } = require("winston")
const { func } = require("joi")
const { param } = require("../init/cors")



function orderJoi(param) {
    let schema = joi.object({
        product_id: joi.number().min(1).required(),
        quantity: joi.number().min(1).max(5).required()
    }).options({ abortEarly: false })

    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function orderPlace(param, productData, userData) {
    let check = orderJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let order = await Order.create({
        user_id: userData.id,
        product_id: productData.id,
        quantity: param.quantity,
        price: productData.price,
        discount: productData.discount,
        discounted_price: productData.discounted_price,
        total_price: (productData.discounted_price * param.quantity),
        delivery_status: 0,
        order_status: 1,
        payment_status: 1,

    }).catch((err) => {
        return { error: err }
    })
    console.log(order)
    if (!order || order.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "your order placed Successfullyyy..." }
}

async function viewOrder(userData) {

    let search = await sequelize.query("SELECT product.name,product.img_path,orders.quantity,orders.price,orders.discount,orders.discounted_price,orders.total_price FROM orders LEFT JOIN product ON product.id = orders.product_id LEFT JOIN user ON orders.user_id = user.id where user.id=:key", {
        replacements: { key: userData.id },
        type: QueryTypes.SELECT
    })
    if (!search || search.error) {
        return { error: "Cant perform this action try again later" }
    }
    return { data: search }
}

function joiviewOrder(param) {
    let schema = joi.object({
        order_id: joi.number().min(1),
        user_id: joi.number().min(1)

    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

// async function viewALLorder(param) {
//     let check = joiviewOrder(param)
//     if (!check || check.error) {
//         return { error: check.error }
//     }
//     if (param.order_id) {
//         let search = await sequelize.query("SELECT user.name AS user_name,orders.id AS order_id ,product.name,product.img_path,orders.quantity,orders.price,orders.discount,orders.discounted_price,orders.total_price FROM orders LEFT JOIN product ON product.id = orders.product_id LEFT JOIN user ON orders.user_id = user.id  Where orders.id = :key", {
//             replacements: { key: param.order_id },
//             type: QueryTypes.SELECT
//         }).catch((err) => {
//             return { error: err }
//         })
//         if (!search || search.error) {
//             return { error: " Internal Server Error" }
//         }
//         return { data: search }
//     }
//     if (param.user_id) {
//         let search = await sequelize.query("SELECT user.name AS user_name,orders.id AS order_id ,product.name,product.img_path,orders.quantity,orders.price,orders.discount,orders.discounted_price,orders.total_price FROM orders LEFT JOIN product ON product.id = orders.product_id LEFT JOIN user ON orders.user_id = user.id  Where user.id=:key", {
//             replacements: { key: param.user_id },
//             type: QueryTypes.SELECT
//         }).catch((err) => {
//             return { error: err }
//         })
//         if (!search || search.error) {
//             return { error: " Internal Server Error" }
//         }
//         return { data: search }
//     }
//     let search = await sequelize.query("SELECT user.name AS user_name,orders.id AS order_id ,product.name,product.img_path,orders.quantity,orders.price,orders.discount,orders.discounted_price,orders.total_price FROM orders LEFT JOIN product ON product.id = orders.product_id LEFT JOIN user ON orders.user_id = user.id ", {
//         type: QueryTypes.SELECT
//     }).catch((err) => {
//         return { error: err }
//     })
//     if (!search || search.error) {
//         return { error: " Internal Server Error" }
//     }
//     return { data: search }

// }

async function viewALLorder(param) {
    let query = "SELECT user.name AS user_name,orders.id AS order_id ,product.name,product.img_path,orders.quantity,orders.price,orders.discount,orders.discounted_price,orders.total_price FROM orders LEFT JOIN product ON product.id = orders.product_id LEFT JOIN user ON orders.user_id = user.id ";
    if (param.order_id) {
        query += `where orders.id = ${param.order_id}`
    } else if (param.user_id) {
        query += `where user.id=${param.user_id}`
    }

    let search = await sequelize.query(query, {
        type: QueryTypes.SELECT
    }).catch((err) => {
        return { error: err }
    })
    if (!search || search.error) {
        return { error: search.error }
    }
    return { data: search }

}

function cancelOrderJoi(param) {

    let schema = joi.object({
        order_id: joi.number().min(1).required()
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }

}

async function orderCancel(param, userData) {
    let check = cancelOrderJoi(param)
    if (check.error) {
        return { error: check.error }
    }

    let find = await Order.findOne({
        where: {
            id: order_id,
            user_id: userData.id
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: " Internal server Error" }
    }
    let cancel = await Order.update({ orderPlace: 3, updatedBy: userData.id }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!cancel || cancel.error) {
        return { error: "Something went wrong" }
    }
    return { data: " Order cancelled successfullyy" }

}

module.exports = {
    orderPlace,
    viewOrder,
    viewALLorder
}