var q = require('q');

module.exports = function() {

    function execute(db) {
        var defer = q.defer();
        var cursor = db.collection('person').find();
        var queue = [];

        cursor.each(function(err, doc) {
            if (err) {
                defer.reject(err);
            }

            if (doc) {
                var address = doc.address;
                queue.push(db.collection('address').insertOne(address));
            } else {

                //Do not process the cueue until the cursor has reached the end of the query results
                q.all(queue)
                    .then(function() {
                            defer.resolve();
                        },
                        function(error) {
                            defer.reject(error);
                        });
            }
        });

        return defer.promise;
    }

    return {
        execute: execute
    };
};
