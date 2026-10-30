const express = require("express");
const bcrypt = require("bcrypt")

const UserModel = require("../models/User");
const generateToken = require("../utils/generateToken");
const auth = require("../middleware/auth");

const authRouter = express.Router();

authRouter.get('/health', (_request, _response) => {
    return _response.json({
        message: "Auth Router Working"
    });
});

//Route for registering a user
authRouter.post('/register', async (_request, _response) => {

    try {

        const {name, email, password, role} = _request.body;

        if(!name || !email || !password || !role ) { 
            return _response.json({
                success: false,
                message: "All fields are required"
            });
        }

        const userExists = await UserModel.findOne({email});

        if(userExists) {
            return _response.json({
                success: false,
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({
            name,
            email, 
            password: hashedPassword,
            role
        });

        const token = await generateToken(user._id, user.role);

        return _response.json({
            success: true,
            message: "User created",
            token: token,
            user: user
        });

    } catch (err) {
        return _response.status(500).json({
            success: false,
            error: err.message,
            message: "Error from the server side",
        });
    }



});

//Route for login 
authRouter.post("/login", async (_request, _response) => {
    try {

        const {email, password} = _request.body;

        const user = await UserModel.findOne({email});


        if(!user) {
            return _response.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }


        const isMatchingPassword = await bcrypt.compare(password, user.password);

        if(!isMatchingPassword) {
            return _response.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = await generateToken(user._id, user.role);

        return _response.json({
            status: true,
            message: "Login successfull",
            data: {
                token: token,
                user: user
            } 
        });

    } catch (err) {
        return _response.json({
            success: false,
            message: "Server side error",
            error: err.message
        });
    }
});

authRouter.get("/me", auth, async (_request, _response) => {

    const user = _request.user;

    return _response.json({
        success: true,
        data: user 
    });

});


module.exports = authRouter;
