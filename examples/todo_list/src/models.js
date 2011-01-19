todo_list.models = {

    tasks: (function() {

        var tasks;

        return {

            init: function() {
                tasks = [];
            },
        
            add: function(task) {
                if(_.indexOf(tasks, task) === -1) {
                    tasks.push(task);
                    this.dispatch('tasks_updated');
                }
            },

            get_tasks: function() {
                return tasks;
            }

        }

    })()

}
