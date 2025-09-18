const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'Please provide email and password'});
        }

        const userExist = await User.findOne({ email});
        if(userExist){
            return res.status(409).json({message: 'Email already used'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully',
            _id: user.id,
            email: user.email,
            token: generateToken(user.id),
        });

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try{
        const {email, password}= req.body;

        const user = await User.findOne({email});
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch || !user){
            return res.status(401).json({message: 'Invalid email or password'});
        }

        res.status(200).json({
            message: 'login successful',
            _id: user.id,
            email: user.email,
            token: generateToken(user.id),
        });

    }catch(error){
        return res.status(500).json({message: error.message})
    }
};

const profile = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        _id: user.id,
        email: user.email,
    });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });
};

module.exports = {register, login, profile};
