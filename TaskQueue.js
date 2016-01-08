var TaskQueue = module.exports = function TaskQueue() {
    this.queue = [];
};

TaskQueue.prototype.push = function(name, func, args) {
    this.queue.push({
        name: name,
        func: func,
        args: args
    });
};

TaskQueue.prototype.process = function(taskIndex, results) {
    var $this = this;

    results = results || [];
    taskIndex = taskIndex || 0;
    var task = $this.queue[taskIndex];

    console.log('Executing: ' + task.name);
    return task.func.apply($this, task.args)
        .then(function(result) {
            results.push(result);
            console.log('Finished: ' + task.name);

            var nextTaskId = taskIndex + 1;
            if (nextTaskId <= ($this.queue.length - 1)) {
                return $this.process.call($this, nextTaskId);
            }

            return results;
        }, function(error) {
            return q.reject(error);
        });
};
