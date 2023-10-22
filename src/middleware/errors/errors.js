import EErrors from "../../services/errors/enums.js";



export default(error,req,res,next)=>{
    error.stack = '';
    console.log(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPES:
            res.status(400).json({ status: "error", error: error.name, cause: error.cause });
            break;
    
        default:
            res.send({status:'error',error:'unhandled error'})   
    }
}   