const ActiveDirectory = require('activedirectory');
const prisma = require('../services/prismaClientService');
const dateService = require('../services/dateService');
const jwt = require('jsonwebtoken');

const loginService = {
    adVerification: async (req, res, account, password) => {
        let config = {
            url: 'ldap://192.168.22.100',
            baseDN: 'OU=GROUP,DC=ABC,DC=com,DC=tw',
            username: `${account}@example.com.tw`,
            password: password
        };

        let ad = new ActiveDirectory(config);
        ad.authenticate(`${account}@example.com.tw`, password, function (err, auth) {
            if (err) {
                console.log('AD' + err);
                res.status(401).send({
                    status: 'fail',
                    data: '未知錯誤'
                });
            }

            if (auth) {
                ad.findUser(account, function (err, user) {
                    if (err) {
                        // 單獨用findUser驗證如帳密錯誤會報錯(會執行登入和find，因此會有兩次response)，所以先使用 ad.authenticate 進行驗證，過濾後再執行 findUser
                        console.log('ERROR: ' + JSON.stringify(err));
                        return;
                    }

                    if (!user) {
                        res.status(401).send({
                            status: 'fail',
                            data: '帳號或密碼錯誤'
                        });
                    } else {
                        // JWT 認證
                        const token = jwt.sign({ EmployeeID: account }, process.env.PASSPORT_SECRET, { expiresIn: '1min' });

                        dateService.MSSQLDate().then((dateObj) => {
                            res.status(200).send({
                                status: 'success',
                                data: {
                                    EmployeeName: user.displayName,
                                    LoginDay: dateObj.TWDate,
                                    LoginTime: dateObj.TWTime,
                                    Token: token
                                }
                            })
                        })
                    };
                });
            }
            else {
                console.log('Authentication failed!');
            }
        });
    },
    systemVerification: async (res, account, password) => {
        try {
            const user = await prisma.users.findMany({
                where: {
                    EmployeeID: account,
                    Active: 1
                },
                select: {
                    EmployeeID: true
                }
            });

            if (user.length == 0) {
                res.status(401).send({
                    status: 'fail',
                    data: '未經核可，無法使用打卡系統'
                })
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.log(error);
            res.status(417).send({
                status: 'fail',
                data: error
            })
        }
    }
}

module.exports = loginService;