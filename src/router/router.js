import AuthController from '../controller/authController'
import CriteriaController from '../controller/criteriaController'
import UserController from '../controller/userController'

export default (app) => {
  //Auth
  app.route('/register').post((request,response) => {AuthController.register(request, response)})
  app.route('/login').post((request,response) => {AuthController.login(request, response)})
  app.route('/profile').get((request,response) => {AuthController.profile(request, response)})
  app.route('/logout').post((request,response) => {AuthController.logout(request, response)})

  //Criteria
  app.route('/criteria').post((request,response) => {CriteriaController.create(request, response)})
  app.route('/criteria/:criteriaId').put((request,response) => {CriteriaController.update(request, response)})
  app.route('/criteria/:criteriaId').get((request,response) => {CriteriaController.read(request, response)})
  app.route('/criteria/').get((request,response) => {CriteriaController.read(request, response)})
  app.route('/criteria/:criteriaId').delete((request,response) => {CriteriaController.delete(request, response)})

  //User
  app.route('/user').post((request,response) => {AuthController.register(request, response)})
  app.route('/user/:userId').put((request,response) => {UserController.update(request, response)})
  app.route('/user/:userId').get((request,response) => {UserController.read(request, response)})
  app.route('/user/').get((request,response) => {UserController.read(request, response)})
  app.route('/user/:userId').delete((request,response) => {UserController.delete(request, response)})
}
