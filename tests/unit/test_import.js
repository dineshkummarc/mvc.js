TestCase('import', {

    setUp: function() {
        create = xray_specs.stub();

        dependencies = {
            register: xray_specs.stub()
        }

        imports = mvc.imports(create, dependencies);
    },

    'test that mvc.imports is a function': function() {
        assertFunction(mvc.imports);
    },

    'test that it returns a register function': function() {
        assertFunction(imports);
    },

    'test that function is called for each import': function() {
        var test_import = {};

        imports({
            'test': test_import
        });

        assertTrue(create.called());
        assertTrue(create.called_with(test_import));
    },

    'test that each import is registered as a dependency': function() {
        var test_import = {};

        imports({
            'test': test_import
        });

        assertTrue(dependencies.register.called());
        assertTrue(dependencies.register.called_with('test', test_import));
    },

    'test that an error is thrown if no init function is provided': function() {
        assertException(function() {
            mvc.imports();
        });
    },
    
    'test that an error is thrown if no dependency object is provided': function() {
        assertException(function() {
            mvc.imports(function() {});
        });
    }

});
