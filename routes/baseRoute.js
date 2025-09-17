const { Router } = require("express");
const baseControllers = require("../controllers/baseController");

const routes = Router();

routes.get("/", baseControllers.getMainPage);

routes.get("/login", baseControllers.getLoginPage);
routes.post("/login", baseControllers.postLogin);

routes.get("/signUp", baseControllers.getSignUpPage);
routes.post("/signUp", baseControllers.postSignUp);

routes.post("/logout", baseControllers.postLogout);


module.exports = routes;