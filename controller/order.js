let { findproduct } = require("../model/product")
let { orderPlace, viewOrder, viewALLorder } = require("../model/order")

async function placeOrder(request, response) {
    let data = await findproduct(request.body).catch((err) => {
        return { error: err }
    })
    if (!data || data.error) {
        return response.status(500).send({ error: data.error })
    }

    let place = await orderPlace(request.body, data.data[0], request.userData).catch((err) => {
        return { error: err }
    })
    if (!place || place.error) {
        return response.status(500).send({ error: place.error })
    }
    return response.status(200).send({ data: place })
}


async function orderView(request, response) {
    let find = await viewOrder(request.userData).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return response.status(500).send({ error: find.error })
    }
    return response.status(200).send(find)
}

async function orderAllview(request, response) {
    let find = await viewALLorder(request.body).catch((err) => {
        return { error: err }
    })
    console.log(find)
    if (!find || find.error) {
        return response.status(500).send({ error: find.error })
    }
    return response.status(200).send(find)
}
module.exports = {
    placeOrder,
    orderView,
    orderAllview
}