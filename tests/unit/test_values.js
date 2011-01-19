TestCase('config', {

    setUp: function() {
        dependencies = {
            register: xray_specs.stub()
        }

        config = mvc.config(dependencies);
    },

    'test that config are sent to dependencies.register': function() {
        config({
            'first': 1,
            'second': 2
        });

        assertTrue(dependencies.register.called_exactly(2));
        assertTrue(dependencies.register.called_with('first', 1));
        assertTrue(dependencies.register.called_with('second', 2));
    },

    'test that it returns a register function': function() {
        assertFunction(config);
    },

    'test that an exception is thrown if no config are defined': function() {
        assertException(function() {
            config();
        });
    }

});
