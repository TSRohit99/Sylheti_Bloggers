const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: 'mykey.json',
});

const bucket = storage.bucket('sylhetibloggers');

// Configure Multer to upload files to Google Cloud Storage
const multerGoogleStorage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Maximum file size (5MB)
    },
});

const uploadToGoogleCloud = async (files,x) => {
    const publicUrls = [];

    try {
        if(x===1){
            const blob = bucket.file(`images/${files.fieldname}_${Date.now()}${path.extname(files.originalname)}`);
            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: files.mimetype,
                },
            });

            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    console.error('Error uploading file:', err);
                    reject(err);
                });

                blobStream.on('finish', async () => {
                    try {
                        await blob.makePublic();
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        publicUrls.push(publicUrl);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });

                blobStream.end(files.buffer);
            });
        } 
        else {
        for (const file of files) {
            const blob = bucket.file(`images/${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: file.mimetype,
                },
            });

            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    console.error('Error uploading file:', err);
                    reject(err);
                });

                blobStream.on('finish', async () => {
                    try {
                        await blob.makePublic();
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        publicUrls.push(publicUrl);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });

                blobStream.end(file.buffer);
            });
        }
        
        }


        return publicUrls;
    } catch (err) {
        console.error('Error uploading files:', err);
        throw err; // Propagate the error
    }
};

module.exports = {
    multerGoogleStorage,
    uploadToGoogleCloud,
};
