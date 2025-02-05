import __dirname from "./index.js";
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log(file.mimetype);
        
        // Verificar el tipo de archivo
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/msword' || 
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.mimetype === 'text/plain') {
            // Documentos
            cb(null, `${__dirname}/../public/docs`);
        } else if (file.mimetype === 'image/webp' || 
                   file.mimetype === 'image/jpeg' || 
                   file.mimetype === 'image/png') {
            // Imágenes
            cb(null, `${__dirname}/../public/img/pets`);
        } else {
            // Otros tipos de archivos
            cb(null, `${__dirname}/../public/others`);
        }
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({storage})

export default uploader;