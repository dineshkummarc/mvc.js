TestCase('values', {

    setUp: function() {
        dependencies = {
            register: xray_specs.stub()
        }
    },

    'test that values are sent to dependencies.register': function() {
        mvc.values({
            'first': 1,
            'second': 2
        }, dependencies);

        assertTrue(dependencies.register.called_exactly(2));
        assertTrue(dependencies.register.called_with('first', 1));
        assertTrue(dependencies.register.called_with('second', 2));
    },

    'test that an exception is thrown if no values are defined': function() {
        assertException(function() {
            mvc.values();
        });
    }

});
