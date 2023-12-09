import sharp from "sharp";

export const handleResize = async (filePath, fileName, size) => {
    await sharp(filePath)
        .resize(size)
        .toFile(`./optimized/${fileName}`)
        .catch(err => console.log(err))
}