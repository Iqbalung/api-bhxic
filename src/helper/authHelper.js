
import bcrypt from 'bcrypt'
import AppConfig from '../config/appConfig'

class AuthHelper {
  async generatePassword(password) {
    return bcrypt.hashSync(password, AppConfig.authenticate.saltHashPassword)
  }

  async passwordCheck(password, user){
    const passwordMatch = bcrypt.compareSync(password, user.password)

    return passwordMatch
  }
}

export default AuthHelper