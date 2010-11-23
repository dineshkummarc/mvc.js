TestCase('controllers', {

    setUp: function() {
        events = {
            dispatch: xray_specs.stub(),
            listen: xray_specs.stub()
        }

        dependencies = {
            inject: xray_specs.stub()
        }
    },

    'test that controllers is a function': function() {
        assertFunction(mvc.controllers);
    },

    'test that controllers are registered as event listeners': function() {
        var command = xray_specs.stub();

        mvc.controllers({
            test: {
                command: command
            }
        }, events, dependencies);

        assertTrue(events.listen.called());
        assertTrue(events.listen.called_with('test', command));
    },

    'test that an exception is thrown if no controllers are defined': function() {
        assertException(function() {
            mvc.controllers();
        });
    },

    'test that an exception is not thrown if no requirements are defined': function() {
        assertNoException(function() {
            mvc.controllers({}, events, dependencies);
        });
    },

    'test that an exception is thrown if no command function is defined': function() {
        assertException(function() {
            mvc.controllers({
                'test': {}
            }, events, dependencies);
        });
    },

    'test that an exception is thrown if an event object is not defined': function() {
        assertException(function() {
            mvc.controllers({
                'test': {
                    command: function() {}
                }
            });
        });
    },

    'test that an exception is thrown if an event.dispatch is not defined': function() {
        assertException(function() {
            mvc.controllers({
                'test': {
                    command: function() {}
                }
            }, {}, dependencies);
        });
    },

    'test that requirements are injected from dependencies': function() {
        var requires = ['first', 'second'];

        mvc.controllers({
            'test': {
                requires: requires,
                command: function() {}
            }
        }, events, dependencies);

        assertTrue(dependencies.inject.called());
        assertTrue(dependencies.inject.called_with(requires));
    },

    'test that an error is thrown if requirements is not an array': function() {
        assertException(function() {
            mvc.controllers({
                'test': {
                    requires: 'requires',
                    command: function() {}
                }
            }, events, dependencies);
        });
    }

});
