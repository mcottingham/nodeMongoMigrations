module.exports = function() {
    var q = require('q');

    function execute(db) {
        var defer = q.defer();

        db.collection('person').insertOne({
                "firstName": "Christian",
                "lastName": "Tempro",
                "address": {
                    "street": "491 Woodbine Blvd SW",
                    "city": "Calgary",
                    "province": "Alberta"
                }
            })
            .then(function(result) {
                    //Could return some results if we wanted to
                    defer.resolve();
                },
                function(error) {
                    defer.reject(error);
                })

        return defer.promise;
    };

    return {
        execute: execute
    };
};
