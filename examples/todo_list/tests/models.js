TestCase('list model', {

    setUp: function() {
        list = todo_list.models.tasks;

        xray_specs.stub(list, 'dispatch');

        list.init();
    },

    tearDown: function() {

    },

    'test that add method adds a task to the array': function() {
        list.add('New task');

        assertEquals(['New task'], list.get_tasks());
    },

    'test that task_added is dispatched when a new task is added': function() {
        list.add('New task');
        
        assertTrue(list.dispatch.called_with('tasks_updated'));
    },

    'test that duplicate tasks are not added': function() {
        list.add('New task');
        list.add('New task');

        assertEquals(['New task'], list.get_tasks());
    }

});
