const prisma = require('../services/prismaClientService');

const dateService = {
    MSSQLDate: async () => {
        let dateString = await prisma.$queryRaw`SELECT GETDATE() as DateTime`;
        let date = dateString[0].DateTime.substring(0, 10).replace(/-/g, '/');
        let time = dateString[0].DateTime.substring(11, 19).replace(/-/g, '/');

        return {
            TWDate: date,
            TWTime: time
        }
    }
}

module.exports = dateService;