TestCase('models', {
    
    setUp: function() {
        events = {
            dispatch: xray_specs.stub(),
            listen: xray_specs.stub()
        }

        dependencies = {
            inject: xray_specs.stub(),
            register: xray_specs.stub()
        }

        collection = {
            create: xray_specs.stub()
        }

        models = mvc.models(events, dependencies, collection);
    },

    'test that mvc.models is a function': function() {
        assertFunction(mvc.models);
    },

    'test that it returns a register function': function() {
        assertFunction(models);
    },

    'test that the init is called on the model': function() {
        var stub = xray_specs.stub();

        models({
            'test': {
                init: stub
            }
        });

        assertTrue(stub.called());
    },

    'test that multiple models can be registered': function() {
        var stub = xray_specs.stub();

        models({
            'test': {
                init: stub
            },
            
            'another_test': {
                init: stub
            }
        });

        assertTrue(stub.called_exactly(2));
    },

    'test that an exception is thrown if no model object is provided': function() {
        assertException(function() {
            models();
        });
    },

    'test that an exception is not thrown if no init method is provided': function() {
        assertNoException(function() {
            models({
                'test': {}
            });
        });
    },

    'test that model proxies are given a reference to events.dispatch': function() {
        var facade = {};

        models({
            'test': facade
        });

        assertEquals(events.dispatch, facade.dispatch);
    },

    'test that models are defined as dependencies': function() {
        var model = {}

        models({
            'test': model
        });

        assertTrue(dependencies.register.called());
        assertTrue(dependencies.register.called_with_exactly('test', model));
    },

    'test that models dependencies are automatically injected': function() {
        var model = {
            test: {},
            another: {}
        }

        models({
            'test': model
        });

        assertTrue(dependencies.inject.called());
        assertTrue(dependencies.inject.called_with(model));
    },

    'test that if a contructor is registered then a collection object is registered as a dependency': function() {
        models({
            User: function() {}
        });

        assertTrue(dependencies.register.called());
    },

    'test that a collection object is created if a constructer is registered': function() {
        constructor = function() {};

        models({
            User: constructor
        });

        assertTrue(collection.create.called_with('User', constructor));
    }

});
