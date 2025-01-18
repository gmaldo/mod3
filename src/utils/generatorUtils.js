import {fakerES_MX as faker} from '@faker-js/faker'; 
import {createHash} from './index.js'; 

export const generateUsers = (numUsers) => {
    let users = [];
    for (let i = 0; i < numUsers; i++) {
        const userType = faker.number.float() < 0.5 ? 'user' : 'admin'; 
        users.push({
            _id: faker.database.mongodbObjectId(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int({ min: 18, max: 80 }),
            password: createHash("coder123"),
            role: userType,
            pets: []
        });
    }
    return users;
}

export const generatePets = (numPets) => {
    let pets = [];
    for (let i = 0; i < numPets; i++) {
        pets.push({
            _id: faker.database.mongodbObjectId(),
            name: faker.animal.petName(),
            specie: faker.animal.type(),
            birthDate: faker.date.past({ years: 10 }).toISOString().split('T')[0],
            adopted: false,
            //owner: faker.database.mongodbObjectId(),
            image: faker.image.urlLoremFlickr({ category: 'pets' })
        });
    }
    return pets
}
