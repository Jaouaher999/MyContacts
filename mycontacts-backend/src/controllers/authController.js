const authService = require("../services/authService");
const { apiResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const user = await authService.register(email, password);
        return apiResponse(res, 201, 'User registered successfully', user);
    } catch(error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try{
        const {email, password}= req.body;
        const user = await authService.login(email, password);
        return apiResponse(res, 200, 'Login successful', user);
    }catch(error){
        next(error);
    }
};

const profile = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        _id: user.id,
        email: user.email,
    });
};

module.exports = {register, login, profile};
