TestCase('tasks view', {

    setUp: function() {
        /*:DOC list =
            <ul></ul>
        */

        list_view = todo_list.views.list;

        list_view.task_list = $(this.list);

        list_view.tasks.get_tasks = xray_specs.stub();

        list_view.tasks.get_tasks.returns = ['One', 'Two', 'Three'];
    },

    tearDown: function() {
        list_view.tasks.reset();
    },

    'test that list view has a method called tasks_updated': function() {
        assertFunction(list_view.tasks_updated);
    },

    'test that all list items are displayed': function() {
        list_view.tasks.get_tasks();

        assertEquals(3, $(this.list).find('ul').length);
    }

});
