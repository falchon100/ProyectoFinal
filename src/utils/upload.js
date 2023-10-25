import multer from "multer";
import __dirname from "./dirname.js";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destination = ""; 
        
        if (file.fieldname === 'profileImage') {
            destination = "./src/public/profiles"; 
        } else if (file.fieldname === "productImage") {
            destination = "./src/public/products"; 
        } else if (["identification", "proofOfAddress", "accountStatus"].includes(file.fieldname)) {
            destination = "./src/public/documents"; 
        }

        cb(null, destination);
    },
    filename: function (req, file, cb) {
        const fieldName = file.fieldname === 'profileImage' ? 'profile' :
            file.fieldname === 'productImage' ? 'product' :
            file.fieldname === 'identification' ? 'identification' :
            file.fieldname === 'proofOfAddress' ? 'proofOfAddress' :
            'accountStatus';
        const filename = `${fieldName}-${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const uploader = multer({ storage });

export default uploader;