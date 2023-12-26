
const cloudinary = require('cloudinary').v2;
const dotenv=require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, {
            resource_type: "auto",
            folder: folder
        },(error, result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        })
    })
}