import momenttz from 'moment-timezone'
import moment from "moment"
import JsonWebToken from "jsonwebtoken"
import AppConfig from '../config/appConfig'

class GlobalHelper {
  async mappingCriteriaData(criteria) {
    let criteriaData = {}

    if (criteria._id) {
      criteriaData._id = criteria._id
    }

    if (criteria.start_date) {
      criteriaData.start_date = await this.formatDateTimezone(criteria.start_date)
    }

    if (criteria.end_date) {
      criteriaData.end_date = await this.formatDateTimezone(criteria.end_date)
    }

    if (criteria.type) {
      criteriaData.type = criteria.type
    }

    if (criteria.created_by) {
      criteriaData.created_by = criteria.created_by
    }

    if (criteria.updated_by) {
      criteriaData.updated_by = criteria.updated_by
    }

    if (criteria.createdAt) {
      criteriaData.createdAt = await this.formatDateTimezone(criteria.createdAt)
    }

    if (criteria.updatedAt) {
      criteriaData.updatedAt = await this.formatDateTimezone(criteria.updatedAt)
    }

    return criteriaData
  }

  async mappingUserData(user){
    let userData = {}

    if (user._id) {
      userData._id = user._id
    }
    if (user.email) {
      userData.email = user.email
    }
    if (user.role) {
      userData.role = user.role
    }

    if (user.createdAt) {
      userData.createdAt = await this.formatDateTimezone(user.createdAt)
    }

    if (user.updatedAt) {
      userData.updatedAt = await this.formatDateTimezone(user.updatedAt)
    }

    return userData
  }

  async formatDateTimezone(dateTimezone){

    return momenttz.tz(dateTimezone, "Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
  }

  async paginationOffset(page, limit){
    let offset = 0
    if (page > 1) {
      offset = (page * limit)-limit
    }

    return offset
  }

  async jwtVerify(token) {
    const jwtVerify = JsonWebToken.verify(token, AppConfig.authenticate.secretApp, (error, decoded) => {
      let jwtData = {}
      jwtData.error = ""
      jwtData.auth_data = {}
      if (error) {
          jwtData.error = error.message
      } else {
          jwtData.auth_data = decoded

          let iat = moment(new Date(parseInt(jwtData.auth_data.iat)*1000)).format("YYYY-MM-DD HH:mm:ss")
          let exp = moment(new Date(parseInt(jwtData.auth_data.exp)*1000)).format("YYYY-MM-DD HH:mm:ss")

          delete jwtData.auth_data.iat
          delete jwtData.auth_data.exp
          
          jwtData.auth_data.loginTime = iat
          jwtData.auth_data.expireTime = exp
      }
      return jwtData
    })

    return jwtVerify
  }
}

export default GlobalHelper