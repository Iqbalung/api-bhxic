import Joi from "joi";
import AuthHelper from "../helper/authHelper";
import GlobalHelper from "../helper/globalHelper";
import ValidationHelper from "../helper/validationHelper"
import randomstring from "randomstring"
import {User} from "../model/userModel"
import AppConfig from "../config/appConfig";
import JsonWebToken from 'jsonwebtoken'
import {JwtAuth} from "../model/jwtAuthModel"

class AuthController {
    static async register (request, response) {
        try {
            let input = request.body
            let authHelper = new AuthHelper()
            let validationHelper = new ValidationHelper()

            const ruleValidation = Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            });

            const validation = await validationHelper.validationMessage(input, ruleValidation)

            if (!validation.status) {
                return response.status(400).send(validation)
            }

            const existingUser = await User.findOne({email: input.email}).exec()
            if (existingUser) {
                return response.status(400).send({success:false, message:AppConfig.message.error.emailExist})
            }

            let userCreate = {}
            userCreate.email = input.email
            userCreate.password = await authHelper.generatePassword(input.password)
            userCreate.otp = randomstring.generate()
            const createUser = await User.create(userCreate)

            if (!createUser) {
                return response.status(400).send({success:false, message:AppConfig.message.error.createData})
            }

            return response.send({ success: true, message: `Email ${input.email} created`});

        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }

    static async login (request, response) {
        try {
            const input = request.body
            let authHelper = new AuthHelper()
            let validationHelper = new ValidationHelper()
            let globalHelper = new GlobalHelper()

            const ruleValidation = Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            });

            const validation = await validationHelper.validationMessage(input, ruleValidation)

            if (!validation.status) {
                return response.status(400).send(validation)
            }

            const userData = await User.findOne({email: input.email}).exec()
            if (userData) {
                let res = {}
                res.success = true
                res.message = AppConfig.message.success.login

                const passwordCheck = await authHelper.passwordCheck(input.password, userData)
                if (!passwordCheck) {
                    return response.status(400).send({success:false, message:AppConfig.message.error.authWrong})
                }

                let authData = {
                    userId: userData._id,
                    email: userData.email,
                    role: userData.role,
                    otp: userData.otp
                }

                const token = JsonWebToken.sign(authData, AppConfig.authenticate.secretApp, { expiresIn: AppConfig.authenticate.lifeTimeToken })
                authData.token = token

                const jwtData = await globalHelper.jwtVerify(token)

                if (jwtData.error) {
                    return response.status(400).send({success:false, message:jwtData.error})
                }

                let jwtAuth = {}
                jwtAuth.userId = jwtData.auth_data.userId
                jwtAuth.token = token
                jwtAuth.loginTime = jwtData.auth_data.loginTime
                jwtAuth.expireTime = jwtData.auth_data.expireTime
                await JwtAuth.create(jwtAuth)

                res.data = authData

                return response.send(res);
            }

            return response.json({success: false, message: AppConfig.message.error.emailNotFound})

        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }

    static async logout (request, response) {
        try {
            const token = request.headers['x-auth-token']
            
            const checkJwtAuth = await JwtAuth.findOne({token:token})

            if (checkJwtAuth) {
                const deleteJwtAuth = await JwtAuth.deleteOne({ token: token });

                if (!deleteJwtAuth) {
                    return response.status(400).send({success:false, message:AppConfig.message.error.logoutProcess})
                }

                return response.json({ success: true, message: AppConfig.message.success.logout})
            } else {
                return response.json({ success: true, message: AppConfig.message.error.logout})
            }
        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }

    static async profile (request, response) {
        try {
            let auth = request.auth_data

            return response.send(auth)
        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }
}

export default AuthController