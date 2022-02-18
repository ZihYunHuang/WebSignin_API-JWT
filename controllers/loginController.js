const loginService = require('../services/loginService');


const loginController = {
    login: async (req, res) => {
        let systemVerification = loginService.systemVerification(res, req.body.EmployeeID, req.body.Password);

        systemVerification.then((check) => {
            if (check == true) {
                loginService.adVerification(req, res, req.body.EmployeeID, req.body.Password);
            }
        })
    }
}

module.exports = loginController;