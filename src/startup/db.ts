import winston from "winston";
import mongoose from "mongoose";
import config from "config";

export function dbConn(){
    const db:any = config.get("db");
    mongoose.connect(db)
    .then(() =>   winston.info(`Connected to ${db} ...`));
    //mongodb://localhost:27017/altmall-v3
}