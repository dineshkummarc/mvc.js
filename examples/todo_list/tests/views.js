TestCase('list view', {

    setUp: function() {
        /*:DOC list =
            <div>
                <ul class="task_list"></ul>
            </div>
        */

        list_view = todo_list.views.list;

        list_view.task_list = $(this.list);

        list_view.tasks = {
            get_tasks: xray_specs.stub()
        }

        xray_specs.stub(list_view.tasks, 'get_tasks');
        list_view.tasks.get_tasks.returns (['One', 'Two', 'Three']);
    },

    tearDown: function() {
        list_view.tasks.get_tasks.reset();
    },

    'test that list view has a method called tasks_updated': function() {
        assertFunction(list_view.tasks_updated);
    },

    'test that all list items are displayed': function() {
        list_view.tasks_updated();

        assertEquals(3, $(this.list).find('ul li').length);
        assertEquals('One', $(this.list).find('ul li').eq(0).html());
        assertEquals('Two', $(this.list).find('ul li').eq(1).html());
        assertEquals('Three', $(this.list).find('ul li').eq(2).html());
    },

    'test that list is reset before adding new item': function() {
        list_view.tasks_updated();
        list_view.tasks_updated();

        assertEquals(3, $(this.list).find('ul li').length);
        assertEquals('One', $(this.list).find('ul li').eq(0).html());
        assertEquals('Two', $(this.list).find('ul li').eq(1).html());
        assertEquals('Three', $(this.list).find('ul li').eq(2).html());
    }

});

TestCase('item view', {

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
    },

    'test that input field is reset to initial state after adding a task': function() {
        view.task_form.find('input#task').val('New task');
        view.task_form.find('a#add_task').click();

        assertEquals('', view.task_form.find('input#task').val());
    }

});
