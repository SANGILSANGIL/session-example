var STD = require('../../../bridge/metadata/standards');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = function () {

    function Role() {
    }

    Role.prototype.loadNotification = function(key, options) {
        return function(req, res, next) {

            var loadedData = null;
            var isSuccess = false;

            req.sequelize.transaction(function(t) {
                var query = {
                    where: {
                        key: key
                    }
                };
                return req.models.Notification.find(query).then(function (data) {
                    isSuccess = true;
                    // 로드하려는 노티피케이션이 없는경우
                    if (!data) {
                        var notification = req.models.Notification.build(options);
                        return notification.save().then(function (data) {
                            isSuccess = true;
                            loadedData = data;
                        });
                    } else {
                        isSuccess = true;
                        loadedData = data;
                    }
                });
            }).catch(errorHandler.catchCallback(function(status, data) {
                res.hjson(req, next, status, data);
            })).done(function() {
                if(isSuccess) {
                    req.loadedNotification = loadedData;
                    next();
                }
            });
        }
    };

    return new Role();
};