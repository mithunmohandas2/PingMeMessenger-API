const User = require('../models/userModel');
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');
const generateToken = require("../config/generateToken");
const { verifyHashData, hashData } = require('../config/encryptService');

const test = async (req, res) => {
    res.status(200).json({ message: 'Test success' })
}

// .................Register User - Signup.....................

const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body)  //test 
    const { name, email, password } = req.body
    if (!email || !name || !password) {
        res.status(400).json({ message: "Please fill all input fields" });
        throw new Error("Please fill all input fields")
    }
    const emailMatch = await User.findOne({ email })
    if (emailMatch) {
        res.status(400);
        res.status(400).json({ message: "Email already exists" });
        throw new Error("Email already exists")
    }

    const hashedPassword = await hashData(password)  //hash password with Bcrypt

    const user = new User({ name, email, password: hashedPassword })
    const userData = await user.save();

    if (userData) {
        const token = await generateToken(userData._id)
        res.status(201).json({
            message: "User created successfully",
            data: {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                image: userData.image,
                token,
            },
        })
    } else {
        res.status(400);
        throw new Error("Unable to create user")
    }
})

// .................Login User.......................

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Please fill all input fields" })
    }
    const userData = await User.findOne({ email });
    if (userData && (await verifyHashData(password, userData.password))) {  //user found in database
        const token = await generateToken(userData._id)
        res.status(200).json({
            message: "Login success",
            data: {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                image: userData.image,
                token,
            },
        })
    } else res.status(400).json({ message: "Invalid Credentials" })
})


// .................Upload User Profile Picture........................


const uploadPhoto = async (req, res) => {
    try {
        console.log(req.body._id)
        console.log(req.file.filename)
        const imagePath = '/images/' + req.file.filename
        const user = await User.findOne({ _id: req.body._id });
        if (!user) {
            return res.status(400).json({ error: "User not found" }) // no user found in database
        }
        const profilePicUpdate = await User.updateOne({ _id: req.body._id }, { $set: { image: imagePath } });
        if (profilePicUpdate) {
            const updatedUser = await User.findOne({ _id: req.body._id });
            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image,
                token: req.headers["authorization"],
            })
        }
        else return res.json({ message: "Unable to update profile pic" })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message })
    }
}


// .................Update User Data.........................

const updateUser = async (req, res) => {
    try {
        const { _id } = req.params        // Get the user ID from the URL parameter
        const updatedData = req.body    //form data recieved

        let users = await User.findByIdAndUpdate(_id, updatedData, { new: true });
        if (!users) return res.json({ error: 'User not found' });
        // res.status(200).json(users)

        const updatedUser = await User.findOne({ _id });
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
            token: req.headers["authorization"],
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }
}

// .................Search Users.........................

const userSearch = async (req, res) => {
    try {
        const startLetter = req.body.searchData
        const regex = new RegExp(`^${startLetter}`, 'i');
        const users = await User.find({ name: { $regex: regex } });   //find user with starting letter
        res.status(200).json(users)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }
}

// -----------------delete User-------------------------

const deleteUser = async (req, res) => {
    try {
        console.log(req.body._id)
        const users = await User.findByIdAndDelete({ _id: req.body._id });
        res.status(200).json(users)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    test,
    registerUser,
    loginUser,
    uploadPhoto,
    updateUser,
    userSearch,
    deleteUser,
}