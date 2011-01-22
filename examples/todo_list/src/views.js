todo_list.views = {

    items: {

        view: '__inject:task_form__',
        tasks: '__inject__',

        init: function() {
            var that, $task_field, $task_submit;

            that = this;
            $task_field = this.view.find('input#task');
            $task_submit = this.view.find('a#add_task');
                
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

        var that, load_template, render_template, mark_completed, remove_handler, complete_handler;

        render_template = function(template, context) {
            var html = Mustache.to_html(template, context);
            return html;
        }

        load_template = function(view, dir, file) {
            $.ajax({
                url: dir + file,
                success: function(data) {
                    view.template = data;
                }
            });
        }

        mark_completed = function(elements, completed) {
            _.each(elements, function(element) {
                var task = $(element).find('.task').html();

                if(_.indexOf(completed, task) !== -1) {
                    $(element).addClass('completed');
                }
            });
        }

        remove_handler = function() {
            that.tasks.remove($(this).parent().find('.task').html());
            return false;
        }

        complete_handler = function() {
            that.tasks.complete($(this).parent().find('.task').html());
            return false;
        }

        return {

            tasks: '__inject__',
            task_list: '__inject__',
            template_dir: '__inject__',
            tasks_list_template: '__inject__',

            init: function() {
                that = this;

                this.task_list.find('a.remove').live('click', remove_handler);
                this.task_list.find('a.complete').live('click', complete_handler);

                load_template(this, this.template_dir, this.tasks_list_template);
            },

            tasks_updated: function() {
                var tasks, completed, html;

                tasks = this.tasks.get_tasks();
                completed = this.tasks.get_completed();
                html = render_template(this.template, {tasks: this.tasks.get_tasks()});
                this.task_list.html(html);

                mark_completed(this.task_list.find('li'), completed);
            }

        }

    })()

}
