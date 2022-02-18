const signService = require('../services/signService');

const signController = {
    sign: async (req, res) => {
        let EmployeeID = req.body.EmployeeID;
        let EmployeeName = req.body.EmployeeName;
        let LoginDay = req.body.LoginDay;
        let LoginTime = req.body.LoginTime;
        let SignStatus = req.body.SignStatus;

        const ip =
            (req.headers["x-forwarded-for"] || "").split(",").pop() ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        signService.sign(res, EmployeeID, EmployeeName, LoginDay, LoginTime, SignStatus, ip);
    }
}

module.exports = signController;