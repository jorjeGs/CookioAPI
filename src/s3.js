//S3Client is a class that accepts configuration options and credentials to create a client for Amazon Simple Storage Service (Amazon S3).
import {  S3Client, PutObjectCommand  } from '@aws-sdk/client-s3';
import { AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_PRIVATE_KEY, AWS_BUCKET_NAME } from './config.js';
import fs from 'fs';

//client is an object that contains options for the S3Client constructor.
const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_PRIVATE_KEY
    }
});

//creating a function to upload a file to the bucket
export const uploadFile = async (filePath, imageName) => {
    //we need to create an stream of the file using fs.createReadStream()
    const stream = fs.createReadStream(filePath);
    //params is an object that contains options for the putObject command.
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: imageName,
        Body: stream,
    }
    //putObject is a command that adds an object to a bucket.
    try {
        return await client.send(new PutObjectCommand(params))
    } catch (error) {
        console.log(error)
    }
}