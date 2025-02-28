import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the 'uploads' folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer storage (storing images in the 'uploads' folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // The folder where the image will be uploaded
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename based on timestamp
    }
});

// File size and type validation
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Only JPG, JPEG, and PNG files are allowed') as any, false);
        }
        cb(null, true);
    }
}).single('image');  // Use 'image' field for the file

export { upload };
