todo_list.views = {

    items: {

        task_form: '__inject__',

        init: function() {
            var that, $task_field, $task_submit;

            that = this;
            $task_field = this.task_form.find('input#task');
            $task_submit = this.task_form.find('a#add_task');
                
            $task_submit.click(function() {
                new_task = $task_field.val();

                if(new_task)
                  that.list.add(new_task);

                return false;
            })
        }
           
    },

    list: {

        tasks_updated: function() {}

    }

}
