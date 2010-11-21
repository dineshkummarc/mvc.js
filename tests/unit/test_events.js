TestCase('events', {

    setUp: function() {
        events = mvc.events();
    },

    'test that dispatch is a function': function() {
        assertFunction(events.dispatch);
    },

    'test that listen is a function': function() {
        assertFunction(events.listen);
    },

    'test a callback function is triggered when event is dispatched': function() {
        var callback = xray_specs.stub();

        events.listen('test', callback);
        events.dispatch('test');

        assertTrue(callback.called_exactly(1));
    },

    'test that an exception is thrown if an event string is not passed to events.listen': function() {
        assertException(function() {
            events.listen();
        });
        
        assertException(function() {
            events.listen(function(){});
        });
    },

    'test that an exception is thrown if a callback is not passed to events.listen': function() {
        assertException(function() {
            events.listen('event');
        });
    },

    'test that all registered callbacks are triggered': function() {
        var callback_1 = xray_specs.stub(),
            callback_2 = xray_specs.stub();

        events.listen('test', callback_1);
        events.listen('test', callback_2);
        events.dispatch('test');

        assertTrue(callback_1.called_exactly(1));
        assertTrue(callback_2.called_exactly(1));
    },

    'test that multiple events can be registered': function() {
        var callback = xray_specs.stub();

        events.listen('test', callback);
        events.listen('another_test', callback);

        events.dispatch('test');
        events.dispatch('another_test');

        assertTrue(callback.called_exactly(2));
    },

    'test that no exceptions are thrown if unregistered event is triggered': function() {
        assertNoException(function() {
            events.dispatch('not_an_event');
        });
    },

    'test that parameters can passed with dispatched events': function() {
        var callback = xray_specs.stub();

        events.listen('test', callback);

        events.dispatch('test', ['test parameter']);

        assertTrue(callback.called_exactly(1));
        assertTrue(callback.called_with('test parameter'));
    },

    'test that multiple parameters can passed with dispatched events': function() {
        var callback = xray_specs.stub();

        events.listen('test', callback);

        events.dispatch('test', ['test parameter', 'another parameter']);

        assertTrue(callback.called_exactly(1));
        assertTrue(callback.called_with_exactly('test parameter', 'another parameter'));
    },

    'test that an error is thrown if an event string is not passed to dispatch': function() {
        assertException(function() {
            events.dispatch();
        });
    },
    
    'test that an error is thrown if params is not an array': function() {
        assertException(function() {
            events.dispatch('event', 'invalid param');
        });
    },

    'test that a callbacks context can be defined': function() {
        var callback = function() { this.example = 'changed' },
            context = { example: 'example variable' };

        events.listen('test', callback, context);
        events.dispatch('test');

        assertEquals('changed', context.example);
    }
});
