const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const courseImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'DoubtApp/Course',
        allowed_formats:["jpeg","png","jpg","webp"]
    }
})
const commentImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'DoubtApp/Comment',
        allowed_formats:["jpeg","png","jpg","webp"]
    }
})

module.exports = {
    cloudinary,
    courseImageStorage,
    commentImageStorage
}
