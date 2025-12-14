
import { Request,Response,NextFunction } from "express";


//optimization suggestion 
//we can use the req.user to store the user data in the request object
//so that we don't have to verify the token again and again
//Express's default Request type doesn't know about the user property we attach after JWT verification: 
//so we need to extend the Request type to include the user property

import { Role } from "shared-types";
import { ErrorCodes, sendError } from "../utils/response";
import { verifyToken } from "../utils/jwt";
import { send } from "vite";

export interface AuthRequest extends Request {

user?:{
    userId:string;
    role:Role;
}
}

export const authenticate = (req:AuthRequest,res:Response,next:NextFunction):void =>{

    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            sendError(res,ErrorCodes.UNAUTHORIZED,'you have not provided any token',401);
            return;
        }

        const token = authHeader.substring(7);
        const payload = verifyToken(token);

        if(!payload){
            sendError(res,ErrorCodes.UNAUTHORIZED,'Invalid or expired token',401);
            return;
        }
    } catch (error) {
        
        sendError(res,ErrorCodes.UNAUTHORIZED,'Authentication failed',401)
    }
}


export const requireAdmin = (req:AuthRequest,res:Response,next:NextFunction):void=>{


    if(!req.user){
        sendError(res,ErrorCodes.UNAUTHORIZED,'you are not authenticated',401);
        return;
    }

    if(req.user.role!==Role.ADMIN){
        sendError(res,ErrorCodes.FORBIDDEN,'you do not have permission to access this resource',403);
        return;
    }

    next();
}