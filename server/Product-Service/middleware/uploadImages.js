import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const multerStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
})

const multerFilter = (req, file, cb) =>{
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    }else{
        cb({
            message: "Unsupported file format"
        },
        false
        )
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000 },
});

const productImgResize = async (req, res, next) => {
    if (!req.files) {
        return next();
    }

    const uploadsDir = path.resolve(
        path.join(__dirname, '../public/images/products')
    );

    const originalUploadsDir = path.resolve(
        path.join(__dirname, '../public/images')
    );

    await Promise.all(req.files.map(async (file) => {

        // Sanitize the filename to prevent directory traversal
        const sanitizedFilename = path.basename(file.filename);

        // Construct a safe output path
        const safeOutputPath = path.resolve(
            uploadsDir,
            sanitizedFilename
        );

        // Ensure the output path remains inside the intended directory
        if (!safeOutputPath.startsWith(uploadsDir + path.sep)) {
            throw new Error('Attempted path traversal detected.');
        }

        // Resize and save the image using the validated path
        await sharp(file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(safeOutputPath);

        // Validate the original uploaded file path before deleting it
        const safeInputPath = path.resolve(file.path);

        if (!safeInputPath.startsWith(originalUploadsDir + path.sep)) {
            throw new Error(
                'Attempted path traversal detected during file deletion.'
            );
        }

        await fs.promises.unlink(safeInputPath);
    }));

    next();
};

export default {
    uploadPhoto,
    productImgResize,
};