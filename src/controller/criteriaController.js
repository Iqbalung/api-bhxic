import ValidationHelper from "../helper/validationHelper"
import BaseJoi from 'joi';
import JoiDate from '@joi/date';
import {Criteria} from "../model/criteriaModel"
import AppConfig from "../config/appConfig";
import GlobalHelper from "../helper/globalHelper";

const Joi = BaseJoi.extend(JoiDate);

class CriteriaController {
    static async create (request, response) {
        try {
            let input = request.body
            let validationHelper = new ValidationHelper()

            const ruleValidation = Joi.object().keys({
                start_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").less(Joi.ref('end_date')).required(),
                end_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").greater('now').required(),
                type: Joi.string().required()
            });

            const validation = await validationHelper.validationMessage(input, ruleValidation)
            
            if (!validation.status) {
                return response.status(400).send(validation)
            }

            input.created_by = request.auth_data.email

            const createCriteria = await Criteria.create(input)
            if (!createCriteria) {
                return response.status(400).send({success:false, message:AppConfig.message.error.createData})
            }

            return response.send({ success: true, message: AppConfig.message.success.created, data: createCriteria});
        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }

    static async update (request, response) {
        try {
            let input = request.body
            let criteriaId = request.params.criteriaId
            
            let validationHelper = new ValidationHelper()

            const ruleValidation = Joi.object().keys({
                start_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").less(Joi.ref('end_date')).required(),
                end_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").greater('now').required(),
                type: Joi.string().required()
            });

            const validation = await validationHelper.validationMessage(input, ruleValidation)
            if (!validation.status) {
                return response.status(400).send(validation)
            }

            const checkCriteriaData = await Criteria.findById(criteriaId)
            if (!checkCriteriaData) {
                return response.status(400).send({success:false, message:AppConfig.message.error.dataNotFound})
            }

            let dataUpdate = input
            dataUpdate.updated_by = request.auth_data.email

            const updateCriteria = await Criteria.updateOne(
                {_id:criteriaId}, 
                { $set: dataUpdate}
            )

            if (!updateCriteria) {
                return response.status(400).send({success:false, message:AppConfig.message.error.updateData})
            }
            const dataUpdated = await Criteria.findById(criteriaId)

            return response.send({ success: true, message:AppConfig.message.success.updated, data:dataUpdated});
        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }

    static async read (request, response) {
        try {
            let criteriaId = request.params.criteriaId
            let queryFilter = request.query
            let globalHelper = new GlobalHelper()
            
            if (criteriaId) {
                const criteriaByID = await Criteria.findById(criteriaId)
                if (!criteriaByID) {
                    return response.status(400).send({success:false, message:AppConfig.message.error.dataNotFound})
                }

                let criteriaData = await globalHelper.mappingCriteriaData(criteriaByID)

                return response.send(criteriaData);
            } else {
                let queryCriteria = {}

                if (!queryFilter.page) {
                    queryFilter.page = 1
                }

                if (!queryFilter.limit) {
                    queryFilter.limit = AppConfig.default.limit
                }

                if (queryFilter.type) {
                    queryCriteria.type = queryFilter.type
                }

                if (queryFilter.start_date) {
                    queryCriteria.start_date = {
                        $gte: queryFilter.start_date
                    }
                }

                if (queryFilter.end_date) {
                    queryCriteria.end_date = {
                        $gte: queryFilter.end_date
                    }
                }

                const limit = queryFilter.limit
                const offset = await globalHelper.paginationOffset(queryFilter.page, limit)

                const criteriaData = await Criteria.paginate(queryCriteria, { offset, limit })
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
                
                if (criteriaData['data'].length > 0) {
                    userData['success'] = true
                    let mapCriteria = {}
                    for (let index = 0; index < criteriaData['data'].length; index++) {
                        mapCriteria = await globalHelper.mappingCriteriaData(criteriaData['data'][index])
                        criteriaData['data'][index] = mapCriteria
                    }
                } else {
                    userData['success'] = false
                }

                return response.send(criteriaData);
            }
        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }

    static async delete (request, response) {
        try {
            let criteriaId = request.params.criteriaId

            const criteriaByID = await Criteria.findById(criteriaId)
            if (!criteriaByID) {
                return response.status(400).send({success:false, message:AppConfig.message.error.dataNotFound})
            }
            const deleteCriteria = await Criteria.deleteOne({ _id: criteriaId });

            if (!deleteCriteria) {
                return response.status(400).send({success:false, message:AppConfig.message.error.deleteData})
            }

            return response.send({ success: true, message:AppConfig.message.success.deleted});
        } catch (error) {
            console.log(error)
            return response.json({ success: false, message: error.message ? error.message : error  })
        }
    }
}

export default CriteriaController