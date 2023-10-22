import { Router } from "express";
import { generateProductsList } from "../mocks/productsMocks.js";

const mockRouter = Router();

export default mockRouter;

mockRouter.get('/',async(req,res)=>{
    try {
        res.send(generateProductsList(50))
    } catch (error) {
        console.log(error);
    }
})