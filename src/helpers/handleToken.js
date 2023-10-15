import jwt from 'jsonwebtoken';

const tokenSign = async (user) => {
    return jwt.sign(
        { 
            _id: user.id, 
        },
        process.env.JWT_SECRET, 
        {
            expiresIn: '1h',
        }
    );
};

const tokenVerify = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return null
    }
};

const tokenDecode = async (token) => {};

export { tokenSign, tokenVerify, tokenDecode };