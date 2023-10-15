import { tokenVerify } from "../helpers/handleToken.js";

const CheckAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ").pop()
        const decodedToken = await tokenVerify(token);
        console.log(decodedToken);
        if(decodedToken._id){
            next();
        }
        else{
            res.status(409).json({ message: "Auth failed" });
        }
    } catch (error) {
        res.status(409).json({ message: "Auth middleware failed" });
    }
}

export default CheckAuth;