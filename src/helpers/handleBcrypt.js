//you have to use import instead of require
import bcrypt from 'bcryptjs';

export const encrypt = async (plainText) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainText, salt);
    return passwordHash;
}

export const compare = async (plainText, passwordHash) => {
    return await bcrypt.compare(plainText, passwordHash);
}