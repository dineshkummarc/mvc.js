TestCase('import', {

    setUp: function() {
        create = xray_specs.stub();

        dependencies = {
            register: xray_specs.stub()
        }
    },

    'test that function is called for each import': function() {
        var test_import = {};

        mvc.import({
            'test': test_import
        }, create, dependencies);

        assertTrue(create.called());
        assertTrue(create.called_with(test_import));
    },

    'test that each import is registered as a dependency': function() {
        var test_import = {};

        mvc.import({
            'test': test_import
        }, create, dependencies);

        assertTrue(dependencies.register.called());
        assertTrue(dependencies.register.called_with('test', test_import));
    },

    'test that an error is thrown if no init function is provided': function() {
        assertException(function() {
            mvc.import({});
        });
    },
    
    'test that an error is thrown if no dependency object is provided': function() {
        assertException(function() {
            mvc.import({}, function() {});
        });
    }

});
