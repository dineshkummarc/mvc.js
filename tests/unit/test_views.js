TestCase('views', {

    setUp: function() {
        events = {
            dispatch: xray_specs.stub(),
            listen: xray_specs.stub()
        }

        dependencies = {
            inject: xray_specs.stub()
        }
    },

    'test that mvc.views is a function': function() {
        assertFunction(mvc.views);
    },

    'test that an exception is thrown if an a view object is not supplied': function() {
        assertException(function() {
            mvc.views();
        });
    },

    'test that a views init function is called when registered': function() {
        var init = xray_specs.stub();

        mvc.views({
            test: {
                mediator: {
                    init: init
                }
            }
        }, events, dependencies);

        assertTrue(init.called());
    },

    'test that an exception is thrown is a mediator object is not defined': function() {
        assertException(function() {
            mvc.views({
                test: {}
            }, events, dependencies);
        });
    },

    'test that each views init function is called if multiple objects are registered': function() {
        var init = xray_specs.stub();

        mvc.views({
            test: {
                mediator: {
                    init: init
                }
            },

            another: {
                mediator: {
                    init: init
                }
            }
        }, events, dependencies);

        assertTrue(init.called_exactly(2));
    },

    'test that errors are not thrown if no init method is detected': function() {
        assertNoException(function() {
            mvc.views({
                test: {
                    mediator: {}
                }
            }, events, dependencies);
        });
    },

    'test that view objects can be assigned with an element': function() {
        var element = { test: 'this should be insterted as the view element' },
            view = {};

        mvc.views({
            test: {
                element: element,
                mediator: view
            }
        }, events, dependencies);

        assertEquals(element, view.element);
    },

    'test that an exception is not thrown if no element is defined': function() {
        assertNoException(function() {
            mvc.views({
                test: {
                    mediator: {}
                }
            }, events, dependencies);
        });
    },

    'test that views are given a reference to events.dispatch': function() {
        var view = { mediator: {} };

        mvc.views({
            test: view
        }, events, dependencies);

        assertFunction(view.mediator.dispatch);

        view.mediator.dispatch();

        assertTrue(events.dispatch.called());
    },

    'test that all view methods are assigned as event listeners': function() {
        var first_method = function() {},
            second_method = function() {};

        mvc.views({
            test: {
                mediator: {
                    'first_method': first_method,
                    'second_method': second_method
                }
            }
        }, events, dependencies);

        assertTrue(events.listen.called_exactly(2));
        assertTrue(events.listen.called_with(first_method, second_method));
    },

    'test that view listeners are defined with the view element as the context': function() {
        var mediator = { first_method: function() {} };

        mvc.views({
            test: {
                mediator: mediator
            }
        }, events, dependencies);

        assertTrue(events.listen.called_with_exactly('first_method', mediator.first_method, mediator));
    },

    'test that views can define dependencies': function() {
        var mediator = {},
            requirements = ['first', 'second'];

        mvc.views({
            test: {
                requires: requirements,
                mediator: mediator
            }
        }, events, dependencies);

        assertTrue(dependencies.inject.called_with_exactly(mediator, requirements));
    }

});
