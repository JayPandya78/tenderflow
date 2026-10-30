const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/User");

dotenv.config();

const auth = async (_request, _response, next) => {

    try {

        let token;

        if (
            _request.headers.authorization &&
            _request.headers.authorization.startsWith("Bearer")
        ) {
            token = _request.headers.authorization.split(" ")[1];
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        _request.user = await UserModel.findById(decoded.id).select("-password");

        next();

    } catch(err) {

        return _response.status(401).json({
            message: "Invalid, credentials",
            error: err.message
        });

    }

}

module.exports = auth;