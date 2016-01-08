var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    TaskQueue = require('./TaskQueue');

var _ = require('lodash');
var q = require('q');

var url = 'mongodb://localhost:27017/testMigration';

var steps = ['./InsertPerson', './MigrateAddress'];

var handle = function(result) {};

function migrate() {
    MongoClient.connect(url, function(err, db) {
        var taskQueue = new TaskQueue();

        _.forEach(steps, function(stepName, index) {
            var step = require(stepName)();
            taskQueue.push(stepName, step.execute, [db]);
        });

        taskQueue.process()
            .then(function(results) {
                console.log('Finished Migration');
                db.close();
            }, function(err) {
                console.log(err, err.stack);
                db.close();
            });
    });

};

migrate();
