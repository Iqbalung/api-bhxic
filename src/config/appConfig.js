import { config as dotenv } from "dotenv"
import MessageConfig from "./messageConfig";
dotenv();

const AppConfig = {
    excludeTokenChecks:[
        '/login',
        '/register'
    ],
    authenticate: {
        accessTokenSecret: process.env.JWT_SECRET_KEY,
        saltHashPassword: Number(process.env.SALT_HASH_PASSWORD),
        secretApp: process.env.SECRET,
        lifeTimeToken: process.env.TOKEN_LIFE,
        refreshTimeToken: process.env.REFRESH_TOKEN_LIFE
    },
    default:{
        limit: 10
    },
    message: MessageConfig
}

export default AppConfig