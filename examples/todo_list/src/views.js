todo_list.views = {

    items: {

        task_form: '__inject__',
        tasks: '__inject__',

        init: function() {
            var that, $task_field, $task_submit;

            that = this;
            $task_field = this.task_form.find('input#task');
            $task_submit = this.task_form.find('a#add_task');
                
            $task_submit.click(function() {
                new_task = $task_field.val();

                if(new_task)
                  that.tasks.add(new_task);

                $task_field.val('');

                return false;
            });
        }
           
    },

    list: {

        tasks: '__inject__',
        task_list: '__inject__',

        tasks_updated: function() {
            $list = this.task_list.find('ul');

            $list.empty();

            _.each(this.tasks.get_tasks(), function(task) {
                $list.append('<li>' + task + '</li>');
            });
        }

    }

}
