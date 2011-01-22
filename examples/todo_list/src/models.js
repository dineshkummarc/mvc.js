todo_list.models = {

    tasks: (function() {

        var tasks, completed;

        return {

            init: function() {
                tasks = [];
                completed = [];
            },
        
            add: function(task) {
                if(_.indexOf(tasks, task) === -1) {
                    tasks.push(task);
                    this.dispatch('tasks_updated');
                }
            },

            remove: function(task) {
                tasks = _.without(tasks, task);
                this.dispatch('tasks_updated');
            },

            complete: function(task) {
                if(_.indexOf(tasks, task) !== -1) {
                    completed.push(task);
                    this.dispatch('tasks_updated');
                }
            },

            get_tasks: function() {
                return tasks;
            },

            get_completed: function() {
                return completed;
            }

        }

    })()

}
