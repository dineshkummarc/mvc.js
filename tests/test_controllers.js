TestCase('controllers', {

    setUp: function() {
        events = {
            dispatch: xray_specs.stub(),
            listen: xray_specs.stub()
        }

        dependencies = {
            inject: xray_specs.stub()
        }

        controllers = mvc.controllers(events, dependencies);
    },

    'test that controllers is a function': function() {
        assertFunction(mvc.controllers);
    },

    'test that controllers are registered as event listeners': function() {
        var command = xray_specs.stub();

        controllers({
            'test': {
                command: command
            }
        });

        assertTrue(events.listen.called());
        assertTrue(events.listen.called_with('test', command));
    },

    'test that an exception is thrown if no controllers are defined': function() {
        assertException(function() {
            controllers();
        });
    },

    'test that an exception is thrown if no command function is defined': function() {
        assertException(function() {
            controllers({
                'test': {}
            });
        });
    },

    'test that requirements are injected from dependencies': function() {
        var test = {
            foo: 'dependency',
            bar: 'dependency',
            command: function() {}
        };

        controllers({
            'test': test
        });

        assertTrue(dependencies.inject.called());
    },

    'test that a register function is returned': function() {
        assertFunction(controllers);
    }

});
