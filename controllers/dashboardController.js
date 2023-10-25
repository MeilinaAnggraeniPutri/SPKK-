class dashboardController {
    static async index(req, res, next) {
        res.render('dashboard');
    }
}

module.exports = dashboardController;