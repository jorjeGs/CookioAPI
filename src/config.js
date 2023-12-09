import {config} from 'dotenv';

config();

export const PORT = process.env.PORT || 3000

export const DB_USER = process.env.DB_USER || 'root'
export const DB_PASS = process.env.DB_PASS || ''
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = process.env.DB_PORT || 3306
export const DB_NAME = process.env.DB_NAME || 'cookiodb'
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || ''
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION || ''
export const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY || ''
export const AWS_PRIVATE_KEY = process.env.AWS_PRIVATE_KEY || ''
