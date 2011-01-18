todo_list.models = {

    tasks: (function() {

        var tasks = [];

        return {
        
            add: function(task) {
                tasks.push(task);

                this.dispatch('tasks_updated');
            },

            get_tasks: function() {
                return tasks;
            }

        }

    })()

}
