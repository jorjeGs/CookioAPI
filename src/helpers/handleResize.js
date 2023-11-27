import sharp from "sharp";

export const handleResize = (filePath, fileName, size) => {
    sharp(filePath)
        .resize(size)
        .toFile(`./optimized/${fileName}`)
        .catch(err => console.log(err))
}