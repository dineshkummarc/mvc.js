TestCase('status model', {

    setUp: function() {
        xray_specs.stub(hello_world.models.status, 'dispatch');
    },

    tearDown: function() {
        hello_world.models.status.dispatch.reset();
    },

    'test that status.update is a function': function() {
        assertFunction(hello_world.models.status.update);
    },

    'test that status.update sets the current status as the supplied message': function() {
        hello_world.models.status.update('Hello world');

        assertEquals('Hello world', hello_world.models.status.current());
    },

    'test that status_updated is dispatched when update is called': function() {
        hello_world.models.status.update();
        
        assertTrue(hello_world.models.status.dispatch.called_with('status_updated'));
    }

});
