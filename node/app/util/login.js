module.exports = {
    check: function(req, res, next) {
        console.log("login check")

        var method = req.method.toLowerCase();
        var user = req.body;
        var logout = (method === 'post' && req.url === '/logout');
        var login = (method === 'post' && user);

        // ログアウト
        if (logout) {
            delete req.session.user;
        }

        // ログイン
        if (login) {
            Object.keys(users).forEach(function(name) {
                if (user.name === name && user.pwd === users[name]) {
            req.session.user = {
                        name: user.name,
                        pwd: user.pwd
            };
                }
        });
        }

        // セッションが無ければ ログイン画面へ
        if (!req.session.user) {req.url = '/'}

        next();
    }
}
