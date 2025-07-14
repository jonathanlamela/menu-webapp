import { NextFunction } from "express";
import { Request, Response } from "express";
import * as yup from "yup";

const validateRequest = (schema: yup.Schema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(500).json({
                status: "error",
                message: "validation error",
                type: err.name,
                details: err.message
            });
        }
        return res.status(500).json({ "status": "error", "message": "see server logs" })

    }
}


export default validateRequest;
