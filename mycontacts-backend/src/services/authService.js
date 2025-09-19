const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const {generateToken} = require("./tokenService");

const register = async(email, password) => {
    if(!email || !password){
        throw {status: 400, message:'Please provide email and password'};
    }

    const userExist = await User.findOne({email});
    if(userExist){
        throw {status:409, message: 'Email already used'};
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword
    });

    return {
        _id: user.id,
        email: user.email,
        token: generateToken(user.id)
    }
};

const login = async(email, password) => {
    if(!email || !password){
        throw {status:400, message: 'Please provide email and password'};
    }

    const user = await User.findOne({email});
    if(!user){
        throw {status:401, message:'Invalid credentials'}
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw {status:401, message:'Invalid credentials'};
    }

    return {
        _id: user.id,
        email: user.email,
        token: generateToken(user.id)
    }
};

module.exports = {register, login};