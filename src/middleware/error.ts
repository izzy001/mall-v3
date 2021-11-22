import winston from "winston";

export default function (err: any, res: any, next: any) {
    if (err.message) return winston.error(err.message, err);

  
    res.status(500).send('Something Failed!');
    next();
}