const prisma = require('../services/prismaClientService');
const userAgent = require('user-agents')
const dateService = require('../services/dateService');

const signService = {
    sign: async (res, employeeID, employeeName, loginDay, loginTime, signStatus, signIP) => {
        try {
            dateService.MSSQLDate().then(async (dateObj) => {
                let userAgentData = new userAgent().toString();

                try {
                    await prisma.$executeRaw`INSERT INTO Test.dbo.Signin
                    (EmployeeID, EmployeeName, LoginDay, LoginTime, SignDay, SignTime, SignStatus, SignIP, UserAgent)
                    VALUES(${employeeID}, ${employeeName}, ${loginDay}, ${loginTime}, ${dateObj.TWDate}, ${dateObj.TWTime}, ${signStatus}, ${signIP}, ${userAgentData});
                    `;
                } catch (error) {
                    if (error.meta.code == '2627') {
                        res.status(417).send({
                            status: 'fail',
                            data: '您已打卡，請勿重複打卡'
                        });
                    } else {
                        res.status(418).send({
                            status: 'fail',
                            data: error.meta.message
                        });
                    }
                }

                res.status(201).send({
                    status: 'success',
                    data: {
                        SignDay: dateObj.TWDate,
                        SignTime: dateObj.TWTime
                    }
                });
            });
        } catch (error) {
            res.status(418).send({
                status: 'fail',
                data: error
            });
        }
    }
}

module.exports = signService;