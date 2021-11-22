import config from "config";

export function appConfig(){
    if(!config.get('jwtPrivateKey')) {
            throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
        };
};