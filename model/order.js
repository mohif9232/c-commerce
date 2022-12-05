let { Order}= require("../schema/order")
let joi= require("joi")
let {Product,Op}= require("../schema/product")
const { sequelize, QueryTypes } = require("../init/dbconnect")


function orderJoi(param){
    let schema= joi.object({
        product_id:joi.number().min(1).required(),
        quantity:joi.number().min(1).max(5).required()
    }).options({abortEarly:false})

    let check = schema.validate(param)
    if(check.error){
        let error=[]
        for(let a of check.error.details){
            error.push(a.message)
        }
        return { error : error}
    }
    return {data:check.value}
}

async function orderPlace(param,productData,userData){
     let check =  orderJoi(param)
     if(!check || check.error){
        return { error: check.error}
     }
     let order = await Order.create({
                user_id:userData.id,
                product_id:productData.id,
                quantity : param.quantity,
                price:productData.price,
                discount:productData.discount,
                discounted_price:productData.discounted_price,
                total_price:(productData.discounted_price * param.quantity),
                delivery_status:0,
                order_status:1,
                payment_status:1,

     }).catch((err)=>{
        return {error:err}
     })
     console.log(order)
     if(!order || order.error){
        return {error:"Internal Server Error"}
     }
     return { data : "your order placed Successfullyyy..."}
}

async function viewOrder(userData){

    let search= await sequelize.query("SELECT product.name,product.img_path,orders.quantity,orders.price,orders.discount,orders.discounted_price,orders.total_price FROM orders LEFT JOIN product ON product.id = orders.product_id LEFT JOIN user ON orders.user_id = user.id where user.id=:key",{
        replacements:{key:userData.id},
        type:QueryTypes.SELECT
    })
    if(!search || search.error){
        return { error : "Cant perform this action try again later"}
    }
    return {data:search}
}

module.exports={orderPlace,
                 viewOrder}