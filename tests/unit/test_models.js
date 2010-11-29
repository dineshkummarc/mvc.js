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
    },

    'test that mvc.models is a function': function() {
        assertFunction(mvc.models);
    },

    'test that the init is called on the models facade': function() {
        var stub = xray_specs.stub();

        mvc.models({
            'test': {
                facade: {
                    init: stub
                }
            }
        }, events, dependencies);

        assertTrue(stub.called());
    },

    'test that multiple models can be registered': function() {
        var stub = xray_specs.stub();

        mvc.models({
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
        }, events, dependencies);

        assertTrue(stub.called_exactly(2));
    },

    'test that an exception is thrown if no model object is provided': function() {
        assertException(function() {
            mvc.models();
        });
    },

    'test that an exception is not thrown if no init method is provided': function() {
        assertNoException(function() {
            mvc.models({
                'test': {
                    facade: {}
                }
            }, events, dependencies);
        });
    },

    'test that model proxies are given a reference to events.dispatch': function() {
        var facade = {};

        mvc.models({
            'test': {
                facade: facade
            }
        }, events, dependencies);

        assertEquals(events.dispatch, facade.dispatch);
    },

    'test that models are defined as dependencies': function() {
        var model = {
            facade: {}
        }

        mvc.models({
            'test': model
        }, events, dependencies);

        assertTrue(dependencies.register.called());
        assertTrue(dependencies.register.called_with_exactly('test', model.facade));
    }

});
