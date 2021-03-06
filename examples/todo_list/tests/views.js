TestCase('list view', {

    setUp: function() {
        /*:DOC list =
            <div>
            </div>
        */

        list_view = todo_list.views.list;

        list_view.task_list = $(this.list);

        list_view.tasks = {
            get_tasks: xray_specs.stub(),
            get_completed: xray_specs.stub(),
            remove: xray_specs.stub(),
            complete: xray_specs.stub()
        }

        list_view.tasks.get_tasks.returns(['One', 'Two', 'Three']);
        list_view.tasks.get_completed.returns(['One', 'Two']);

        list_view.template = '<ul>{{#tasks}}<li>{{.}}</li>{{/tasks}}</ul>';
    },

    tearDown: function() {
    },

    'test that list view has a method called tasks_updated': function() {
        assertFunction(list_view.tasks_updated);
    },

    'test that list view has a method called tasks_completed': function() {
        assertFunction(list_view.tasks_completed);
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
    },

    'test that clicking the remove link deletes that task': function() {
        list_view.template = '<ul>{{#tasks}}<li><span class="task">{{.}}</span><a href="#" class="remove">Remove</a></li>{{/tasks}}</ul>';

        list_view.init();
        list_view.tasks_updated();

        $(this.list).find('a.remove').eq(0).click();

        assertTrue(list_view.tasks.remove.called_with('One'));
    },

    'test that clicking the complete button calls tasks.complete with the correct task': function() {
        list_view.template = '<ul>{{#tasks}}<li><span class="task">{{.}}</span><a href="#" class="complete">Complete</a></li>{{/tasks}}</ul>';

        list_view.init();
        list_view.tasks_updated();

        $(this.list).find('a.complete').eq(0).click();

        assertTrue(list_view.tasks.complete.called_with('One'));
    },

    'test that tasks_completed sets a class of completed on all listed tasks': function() {
        list_view.template = '<ul>{{#tasks}}<li><span class="task">{{.}}</span><a href="#" class="complete">Complete</a></li>{{/tasks}}</ul>';

        list_view.init();
        list_view.tasks_completed();

        assertEquals('completed', $(this.list).find('ul li').eq(0).attr('class'));
        assertEquals('completed', $(this.list).find('ul li').eq(1).attr('class'));
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
