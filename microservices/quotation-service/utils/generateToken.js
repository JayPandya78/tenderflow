const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = async (id, role) => {
    return jwt.sign(
        {id, role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
};


module.exports = generateToken;