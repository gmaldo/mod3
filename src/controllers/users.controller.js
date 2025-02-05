import { usersService } from "../services/index.js"
import __dirname from "../utils/index.js";


const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    //const result = await usersService.getUserById(userId);
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.delete(userId);
    res.send({status:"success",message:"User deleted"})
}

const uploadDocuments = async(req, res)=>{
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const files = req.files;
    console.log(files);
    for(let i=0;i<files.length;i++){
        const file = files[i];
        user.documents.push({name:file.originalname,reference:`${__dirname}/../public/docs/${file.filename}`});
    }
    const result = await usersService.update(userId, user);
    res.send({status:"success", message:"Documents uploaded"})
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadDocuments
}