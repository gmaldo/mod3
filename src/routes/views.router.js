import express, { Router } from 'express'
import { generateUsers } from '../utils/generatorUtils.js'
const router = Router()

router.get('/',(req,res)=>{
    const users = generateUsers(1)
    console.log(users[0])
    res.render("index",{user:users[0]})
})

export default router