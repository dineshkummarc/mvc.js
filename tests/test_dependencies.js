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
        var target = {
            test: '__inject__'
        };

        dependencies.register('test', 'this is a requirement');
        dependencies.inject(target);

        assertEquals(target.test, 'this is a requirement');
    },

    'test that multiple dependencies can be required': function() {
        var target = {
            foo: '__inject__',
            bar: '__inject__'
        };

        dependencies.register('foo', 'first dependency');
        dependencies.register('bar', 'second dependency');
        dependencies.inject(target);

        assertEquals('first dependency', target.foo);
        assertEquals('second dependency', target.bar);
    },

    'test that dependencies cannot be overriden': function() {
        dependencies.register('test', {});

        assertException(function() {
            dependencies.register('test', {});
        });
    },

    'test that dependencies are immutable': function() {
        var target_1, target_2;
        
        target_1 = {
            shipping: '__inject__'
        };
        
        target_2 = {
            shipping: '__inject__'
        };

        dependencies.register('shipping', 5);

        dependencies.inject(target_1);
        dependencies.inject(target_2);

        target_1.shipping = 10;

        assertEquals(10, target_1.shipping);
        assertEquals(5, target_2.shipping);
    },

    'test that an eception is thrown if a target object is not sent to inject': function() {
        assertException(function() {
            dependencies.inject();
        });
    },

    'test that an exception is thrown if an name string is not supplied to register': function() {
        assertException(function() {
            dependencies.register({}, {});
        });
    },

    'test that an exception is thrown if a dependency object is not supplied to register': function() {
        assertException(function() {
            dependencies.register('test');
        });
    },

    'test that specific dependencies can be injected by passing string parameters': function() {
        var target = {
            foo: '__inject:shipping__',
            bar: '__inject:vat__'
        };

        dependencies.register('shipping', 10);
        dependencies.register('vat', 17.5);
        dependencies.inject(target);

        assertEquals(10, target.foo);
        assertEquals(17.5, target.bar);
    },

    'test that existing objects are not overriden': function() {
        var target = {
            foo: 'do not inject',
        };

        dependencies.register('foo', 10);
        dependencies.inject(target);

        assertEquals('do not inject', target.foo);
    }

});
