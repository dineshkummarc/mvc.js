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

        xray_specs.mock(view, 'list', {
            add: {}
        });


        view.init();
    },

    'tearDown': function() {
        view.list.reset();
    },

    'test that models.list.add is called when form is submitted': function() {
        view.list.expects('add')
            .with_args.matching('New task');

        view.task_form.find('input#task').val('New task');
        view.task_form.find('a#add_task').click();

        assertTrue(view.list.verify());
    }

});
