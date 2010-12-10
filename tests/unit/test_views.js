TestCase('views', {

    setUp: function() {
        events = {
            dispatch: xray_specs.stub(),
            listen: xray_specs.stub()
        }

        dependencies = {
            inject: xray_specs.stub()
        }

        views = mvc.views(events, dependencies);
    },

    'test that mvc.views is a function': function() {
        assertFunction(mvc.views);
    },

    'test that it returns a register function': function() {
        assertFunction(views);
    },

    'test that an exception is thrown if an a view object is not supplied': function() {
        assertException(function() {
            views();
        });
    },

    'test that a views init function is called when registered': function() {
        var init = xray_specs.stub();

        views({
            test: {
                mediator: {
                    init: init
                }
            }
        });

        assertTrue(init.called());
    },

    'test that an exception is thrown is a mediator object is not defined': function() {
        assertException(function() {
            views({
                test: {}
            });
        });
    },

    'test that each views init function is called if multiple objects are registered': function() {
        var init = xray_specs.stub();

        views({
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
        });

        assertTrue(init.called_exactly(2));
    },

    'test that errors are not thrown if no init method is detected': function() {
        assertNoException(function() {
            views({
                test: {
                    mediator: {}
                }
            });
        });
    },

    'test that view objects can be assigned with an element': function() {
        var element = { test: 'this should be insterted as the view element' },
            view = {};

        views({
            test: {
                element: element,
                mediator: view
            }
        });

        assertEquals(element, view.element);
    },

    'test that an exception is not thrown if no element is defined': function() {
        assertNoException(function() {
            views({
                test: {
                    mediator: {}
                }
            });
        });
    },

    'test that views are given a reference to events.dispatch': function() {
        var view = { mediator: {} };

        views({
            test: view
        });

        assertFunction(view.mediator.dispatch);

        view.mediator.dispatch();

        assertTrue(events.dispatch.called());
    },

    'test that all view methods are assigned as event listeners': function() {
        var first_method = function() {},
            second_method = function() {};

        views({
            test: {
                mediator: {
                    'first_method': first_method,
                    'second_method': second_method
                }
            }
        });

        assertTrue(events.listen.called_exactly(2));
        assertTrue(events.listen.called_with(first_method, second_method));
    },

    'test that view listeners are defined with the view element as the context': function() {
        var mediator = { first_method: function() {} };

        views({
            test: {
                mediator: mediator
            }
        });

        assertTrue(events.listen.called_with_exactly('first_method', mediator.first_method, mediator));
    },

    'test that views can define dependencies': function() {
        var mediator = {},
            requirements = ['first', 'second'];

        views({
            test: {
                requires: requirements,
                mediator: mediator
            }
        });

        assertTrue(dependencies.inject.called_with_exactly(mediator, requirements));
    }

});
