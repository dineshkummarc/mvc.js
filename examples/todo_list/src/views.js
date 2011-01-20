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

    list: (function() {

        var that, load_template;

        load_template = function(view, dir, file) {
            $.ajax({
                url: dir + file,
                success: function(data) {
                    view.template = data;
                }
            });
        }

        return {

            tasks: '__inject__',
            task_list: '__inject__',
            template_dir: '__inject__',
            tasks_list_template: '__inject__',

            init: function() {
                that = this;

                load_template(this, this.template_dir, this.tasks_list_template);
            },

            tasks_updated: function() {
                var html = Mustache.to_html(this.template, {tasks: this.tasks.get_tasks()});
                this.task_list.html(html);

                this.task_list.find('a.remove').click(function() {
                    that.tasks.remove($(this).parent().find('.task').html());
                });
            }

        }

    })()

}
