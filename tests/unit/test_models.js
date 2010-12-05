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

        models = mvc.models(events, dependencies);
    },

    'test that mvc.models is a function': function() {
        assertFunction(mvc.models);
    },

    'test that it returns a register function': function() {
        assertFunction(models);
    },

    'test that the init is called on the models facade': function() {
        var stub = xray_specs.stub();

        models({
            'test': {
                facade: {
                    init: stub
                }
            }
        });

        assertTrue(stub.called());
    },

    'test that multiple models can be registered': function() {
        var stub = xray_specs.stub();

        models({
            'test': {
                facade: {
                    init: stub
                }
            },
            
            'another_test': {
                facade: {
                    init: stub
                }
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
                'test': {
                    facade: {}
                }
            });
        });
    },

    'test that model proxies are given a reference to events.dispatch': function() {
        var facade = {};

        models({
            'test': {
                facade: facade
            }
        });

        assertEquals(events.dispatch, facade.dispatch);
    },

    'test that models are defined as dependencies': function() {
        var model = {
            facade: {}
        }

        models({
            'test': model
        });

        assertTrue(dependencies.register.called());
        assertTrue(dependencies.register.called_with_exactly('test', model.facade));
    }

});
