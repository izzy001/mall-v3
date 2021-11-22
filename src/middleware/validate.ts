export default (validator: any) => {
    return (req:any, res:any, next: any) => {
        console.log(`This is the new request ${req.body}`);
        const { error } = validator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        next();
    }
}