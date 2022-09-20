import ValidationHelper from "../helper/validationHelper"
import GlobalHelper from "../helper/globalHelper";
import AuthHelper from "../helper/authHelper";
import AppConfig from "../config/appConfig";
import Joi from "joi";
import {User} from "../model/userModel"

class UserController {

    static async update (request, response) {
        try {
            let input = request.body
            let userId = request.params.userId

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

            const checkUserData = await User.findById(userId)
            if (!checkUserData) {
                return response.status(400).send({success:false, message:AppConfig.message.error.dataNotFound})
            }

            let userUpdate = {}
            userUpdate.email = input.email
            userUpdate.password = await authHelper.generatePassword(input.password)

            const updateUser = await User.updateOne(
                {_id:userId}, 
                { $set: userUpdate}
            )
            if (!updateUser) {
                return response.status(400).send({success:false, message:AppConfig.message.error.updateData})
            }

            return response.send({ success: true, message: AppConfig.message.success.updated});
        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }

    static async read (request, response) {
        try {
            let userId = request.params.userId
            let queryFilter = request.query
            let globalHelper = new GlobalHelper()

            if (userId) {
                const userData = await User.findById(userId)
                if (!userData) {
                    return response.status(400).send({success:false, message:AppConfig.message.error.dataNotFound})
                }

                let userDatas = await globalHelper.mappingUserData(userData)

                return response.send(userDatas);
            } else {
                let queryUser = {}

                if (!queryFilter.page) {
                    queryFilter.page = 1
                }

                if (!queryFilter.limit) {
                    queryFilter.limit = AppConfig.default.limit
                }

                if (queryFilter.email) {
                    queryUser.email = queryFilter.email
                }

                if (queryFilter.role) {
                    queryUser.role = queryFilter.role
                }

                const limit = queryFilter.limit
                const offset = await globalHelper.paginationOffset(queryFilter.page, limit)

                const userData = await User.paginate(queryUser, { offset, limit })
                    .then((criteria) => {
                        return {
                            data: criteria.docs,
                            total: criteria.totalDocs,
                            limit: criteria.limit,
                            totalPages: criteria.totalPages,
                            currentPage: criteria.page,
                            prevPage: criteria.prevPage,
                            nextPage: criteria.nextPage,
                        };
                    })

                if (userData['data'].length > 0) {
                    let mapUser = {}
                    userData['success'] = true
                    for (let index = 0; index < userData['data'].length; index++) {
                        mapUser = await globalHelper.mappingUserData(userData['data'][index])
                        userData['data'][index] = mapUser
                    }
                } else {
                    userData['success'] = false
                }

                return response.send(userData);
            }
        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }

    static async delete (request, response) {
        try {
            let userId = request.params.userId

            const userByID = await User.findById(userId)
            if (!userByID) {
                return response.status(400).send({success:false, message:AppConfig.message.error.dataNotFound})
            }

            if (request.auth_data.userId == userId) {
                return response.status(400).send({success:false, message:"Cannot delete data for himself"})
            }

            const deleteUser = await User.deleteOne({ _id: userId });

            if (!deleteUser) {
                return response.status(400).send({success:false, message:AppConfig.message.error.deleteData})
            }

            return response.send({ success: true, message:AppConfig.message.success.deleted});
        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }
}

export default UserController