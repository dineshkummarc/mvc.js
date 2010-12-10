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

    'test that an exception is not thrown if no requirements are defined': function() {
        assertNoException(function() {
            mvc.controllers({}, events, dependencies);
        });
    },

    'test that an exception is thrown if no command function is defined': function() {
        assertException(function() {
            controllers({
                'test': {}
            });
        });
    },

    'test that an exception is thrown if an event object is not defined': function() {
        assertException(function() {
            mvc.controllers();
        });
    },

    'test that requirements are injected from dependencies': function() {
        var requires = ['first', 'second'];

        controllers({
            'test': {
                requires: requires,
                command: function() {}
            }
        });

        assertTrue(dependencies.inject.called());
        assertTrue(dependencies.inject.called_with(requires));
    },

    'test that an error is thrown if requirements is not an array': function() {
        assertException(function() {
            controllers({
                'test': {
                    requires: 'requires',
                    command: function() {}
                }
            });
        });
    },

    'test that a register function is returned': function() {
        assertFunction(controllers);
    }

});
