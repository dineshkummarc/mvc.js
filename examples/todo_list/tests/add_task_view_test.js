TestCase('add item view', {

    'setUp': function() {
        /*:DOC form = 
           <div>
               <input type="text name="task" id="task" />
               <a id="add_task" href="#">Add task</a>
           </div>
         */

        view = todo_list.views.items;
        
        view.task_form = $(this.form);

        xray_specs.mock(view, 'tasks', {
            add: {}
        });

        view.init();
    },

    'tearDown': function() {
        view.tasks.reset();
    },

    'test that models.list.add is called when form is submitted': function() {
        view.tasks.expects('add')
            .with_args.matching('New task');

        view.task_form.find('input#task').val('New task');
        view.task_form.find('a#add_task').click();

        assertTrue(view.tasks.verify());
    },

    'test that list.add is not called if the form input is blank': function() {
        view.tasks.expects('add')
            .to_be_called.times(0);

        view.task_form.find('a#add_task').click();

        assertTrue(view.tasks.verify());
    }

});
