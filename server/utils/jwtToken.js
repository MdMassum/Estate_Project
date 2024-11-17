import jwt from "jsonwebtoken";


const sendToken = (user, statusCode, res) => {
    
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    const options = {
        expires: new Date(
            Date.now() + parseInt(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax'
    };

    res.status(statusCode).cookie("access_token", token, options).send(user)
};
export default sendToken;