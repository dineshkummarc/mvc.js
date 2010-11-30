TestCase('dependencies', {

    setUp: function() {
        dependencies = mvc.dependencies();
    },
    
    'test that dependencies is a function': function() {
        assertFunction(mvc.dependencies);
    },
    
    'test that dependencies.inject is a function': function() {
        assertFunction(dependencies.inject);
    },
    
    'test that dependencies.register is a function': function() {
        assertFunction(dependencies.register);
    },

    'test that registered dependencies are added on to the target object': function() {
        var target = {},
            dependency = 'this is a requirement';

        dependencies.register('test', dependency);
        dependencies.inject(target, ['test']);

        assertEquals(dependency, target.test);
    },

    'test that multiple dependencies can be required': function() {
        var target = {},
            dependency = 'this is a requirement';
            another_dependency = 'this is another requirement';

        dependencies.register('test', dependency);
        dependencies.register('test_2', another_dependency);
        dependencies.inject(target, ['test', 'test_2']);

        assertEquals(dependency, target.test);
        assertEquals(another_dependency, target.test_2);
    },

    'test that dependencies cannot be overriden': function() {
        dependencies.register('test', {});

        assertException(function() {
            dependencies.register('test', {});
        });
    },

    'test that dependencies are immutable': function() {
        var target_1 = {},
            target_2 = {};

        dependencies.register('shipping', 5);

        dependencies.inject(target_1, ['shipping']);
        dependencies.inject(target_2, ['shipping']);

        target_1.shipping = 10;

        assertEquals(10, target_1.shipping);
        assertEquals(5, target_2.shipping);
    },

    'test that an eception is thrown if a target object is not sent to inject': function() {
        assertException(function() {
            dependencies.inject();
        });
    },

    'test that an exception is thrown if requirements are not sent to inject': function() {
        assertException(function() {
            dependencies.inject({}, {});
        });
    },

    'test that an exception is thrown if an name string is not supplied to register': function() {
        assertException(function() {
            dependencies.inject({}, {});
        });
    },

    'test that an exception is thrown if a dependency object is not supplied to register': function() {
        assertException(function() {
            dependencies.inject('test');
        });
    }
});
