import multer from "multer";
import __dirname from "./dirname.js";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        /* let destination = `${__dirname}/../public/documents`; */
        let destination ="";
        console.log('CONSOLE LOG ' +file);
        if (file.fieldname === 'profileImage'){
            destination = `${__dirname}/../public/profiles`;
        } else if (file.fieldname === "productImage"){
            destination = `${__dirname}/../public/products`;
        }else if (file.fieldname === "identification" || "proofOfAddress" || "accountStatus "){
            destination = `${__dirname}/../public/documents`
        }

        cb(null, destination);
    },
    filename: function(req, file, cb){
        // Agrego un identificador al nombre del archivo basado en el campo del formulario
        const fieldName = file.fieldname === 'profileImage' ? 'profile' :
                          file.fieldname === 'productImage' ? 'product' :
                          file.fieldname === 'identification'? 'identification':
                          file.fieldname === 'proofOfAddress'? 'proofOfAddress':
                          'accountStatus';
        const filename = `${fieldName}-${Date.now()}-${file.originalname}`;
        cb(null, filename);
    } //ejemplo : "product-1696299477963-foto..jpg"
});

const uploader = multer({storage})

export default uploader;