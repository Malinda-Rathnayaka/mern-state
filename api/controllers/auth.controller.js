import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async(req , res) =>{

    const {username, email, password } = req.body;
    const hashpassword = bcrypt.hashSync(password,10);
    const newUser = new User ({username, email, password:hashpassword});
    try {
        await newUser.save()
        res.status(201).send('User create successfully!');
        
    } catch (error) {
        res.status(500).json(error.message);
    }
    
}