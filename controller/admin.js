let {loginadmin, assignpermission,findall,update,getpermission,getpermission2,softdelete,softundelete,unactive,active}= require("../model/admin")
let {User}= require("../schema/user")
let excel= require("../helper/excel")

async function login(request,response){
    let task=await loginadmin(request.body).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send({data:task})
}

async function addpermission(request,response){
    let task=await assignpermission(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send({data:task})
}


async function finduser(request,response){
    let task=await findall(request.body).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send({data:task})
}

async function updateuser(request,response){
    let task=await update(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send({data:task})
}

async function permission(request,response){
    let task=await getpermission().catch((err)=>{
        return {error:err}
    })
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send(task)
}
async function userpermission(request,response){
    let task=await getpermission2(request.body).catch((err)=>{
        return {error:err}
    })
    console.log(task)
    console.log(task)
    if(!task || (task && task.error)){
        return response.status(401).send({error:task.error})
    }
    return response.send(task)
}


async function softdeleteuser(request,response){
    let done=await softdelete(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    if(!done || done.error){
        return response.status(401).send({error:done.error})
    };
    return  response.send({data:done})
}
async function softundeleteuser(request,response){
    let done=await softundelete(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    if(!done || done.error){
        return response.status(401).send({error:done.error})
    };
    return  response.send({data:done})
}

async function activeuser(request,response){
    let done=await active(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    if(!done || done.error){
        return response.status(401).send({error:done.error})
    };
    return  response.send({data:done})
}
async function unactiveuser(request,response){
    let done=await unactive(request.body,request.userData).catch((err)=>{
        return {error:err}
    })
    console.log(done)
    if(!done || done.error){
        return response.status(401).send({error:done.error})
    };
    return  response.send({data:done})
}

// export userss

async function exporUsert(request,response){
    let find = await User.findAll({raw:true}).catch((err)=>{
        return { error: err}
    })
    if(!find || find.error){
        return response.status(500).send({ error: "Internal server Error"})
    }
    let columns=[
        { header: 'id', key: 'id', width: 10 },
        { header: 'name', key: 'name', width: 10 },
        { header: 'username', key: 'username', width: 10 },
        { header: 'phone', key: 'phone', width: 10 },
                ]
        
    let filename= "users";

    await excel(request,response,filename,columns,find).then((data)=>{
        return { data:data }
    }).catch((err)=>{
        return { error: err}
    })

}

module.exports= {login, addpermission,finduser,updateuser,permission,userpermission, softdeleteuser,softundeleteuser,activeuser,unactiveuser, exporUsert}
