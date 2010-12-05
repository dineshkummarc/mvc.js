TestCase('values', {

    setUp: function() {
        dependencies = {
            register: xray_specs.stub()
        }

        values = mvc.values(dependencies);
    },

    'test that values are sent to dependencies.register': function() {
        values({
            'first': 1,
            'second': 2
        });

        assertTrue(dependencies.register.called_exactly(2));
        assertTrue(dependencies.register.called_with('first', 1));
        assertTrue(dependencies.register.called_with('second', 2));
    },

    'test that it returns a register function': function() {
        assertFunction(values);
    },

    'test that an exception is thrown if no values are defined': function() {
        assertException(function() {
            values();
        });
    }

});
