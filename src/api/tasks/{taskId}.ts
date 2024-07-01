import {Request, Response} from "express";

export default function() {
    return {
        get: async (req: Request, res: Response) => {
            res.send('Response from POST /tasks');
        },
        put: async (req: Request, res: Response) => {
            res.send('Response from PUT /tasks');
        },
        delete: async (req: Request, res: Response) => {
            res.send('Response from DELETE /tasks');
        }
    };
}
