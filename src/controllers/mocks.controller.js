import { petsService, usersService } from "../services/index.js";
import { generateUsers, generatePets } from "../utils/generatorUtils.js";

const mockingPets = (req,res) => {
    let numPets = req.query.count;
    if (numPets) {
        numPets = parseInt(numPets);
        if (isNaN(numPets) || numPets < 1) {
            return res.status(400).send({ status: "error", message: "La cantidad de mascotas debe ser un número entero positivo." });
        }
    } else {
        numPets = 10
    }
    const pets = generatePets(numPets);
    res.send({status:"success",payload:pets})
}

const mockingUsers = (req, res) => {
    let numUsers = req.query.count;
    if (numUsers) {
        numUsers = parseInt(numUsers);
        if (isNaN(numUsers) || numUsers < 1) {
            return res.status(400).send({ status: "error", message: "La cantidad de usuarios debe ser un número entero positivo." });
        }
    } else {
        numUsers = 50
    }
    const users = generateUsers(numUsers);
    res.send({status:"success", payload:users})
}

const generateData = async(req, res) => {
    let numUsers = req.query.users;
    let numPets = req.query.pets;

    if (numUsers) {
        numUsers = parseInt(numUsers);
        if (isNaN(numUsers) || numUsers < 1) {
            return res.status(400).send({ status: "error", message: "La cantidad de usuarios debe ser un número entero positivo." });
        }
    }else{
        return res.status(400).send({ status: "error", message: "El parámetro 'users' es obligatorio." });
    }
    
    if(numPets) {
        numPets = parseInt(numPets);
        if (isNaN(numPets) || numPets < 1) {
            return res.status(400).send({ status: "error", message: "La cantidad de mascotas debe ser un número entero positivo." });
        }
    }else{
        return res.status(400).send({ status: "error", message: "El parámetro 'pets' es obligatorio." });
    }
    const users = generateUsers(numUsers);
    try {
        for(let user of users){
            const newUser = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                password: user.password,
                role: user.role,
                pets: user.pets,
            }
            await usersService.create(newUser)
            //console.log(resp);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "error", message: "Error al guardar los usuarios." });
    }
 
    const pets = generatePets(numPets);
    try {
        for(let pet of pets){
            await petsService.create(pet)
            //console.log(resp);
        }
    } catch (error) {
        return res.status(500).send({ status: "error", message: "Error al guardar las mascotas." });
    }
    res.send({ status: "success", payload: "ok" });

}

export default {
    mockingPets,
    mockingUsers,
    generateData
}