TestCase('tasks view', {

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
    }

});
