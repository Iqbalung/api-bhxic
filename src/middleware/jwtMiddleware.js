import AppConfig from "../config/appConfig"
import JsonWebToken from "jsonwebtoken"
import GlobalHelper from "../helper/globalHelper"
import {JwtAuth} from "../model/jwtAuthModel"

export default async (request, response, next) => {
    try {
        if (AppConfig.excludeTokenChecks.indexOf(request.path) !== -1) {
            next()
        } else {
            const token = request.headers['x-auth-token']
            if (token) {
                let globalHelper = new GlobalHelper()
                let checkToken = await globalHelper.jwtVerify(token)

                if (checkToken.error) {
                    await JwtAuth.deleteOne({ token: token });
                    return response.status(403).send({
                        success: false,
                        message: AppConfig.message.error.unauthenticatedFailed
                    })
                } else {
                    const checkJwtAuth = await JwtAuth.findOne({token:token})
                    
                    if (checkJwtAuth) {
                        request.auth_data = checkToken.auth_data
                        next()
                    } else {
                        return response.status(403).send({
                            success: false,
                            message: AppConfig.message.error.unauthenticatedFailed
                        })
                    }
                }
            } else {
                return response.status(403).send({
                    success: false,
                    message: AppConfig.message.error.unauthenticated
                })
            }
        }
    } catch (error) {
        return response.json({success: false, message: error.message})
    }
    next()
}