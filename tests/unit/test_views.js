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
                init: init
            }
        });

        assertTrue(init.called());
    },

    'test that each views init function is called if multiple objects are registered': function() {
        var init = xray_specs.stub();

        views({
            test: {
                init: init
            },

            another: {
                init: init
            }
        });

        assertTrue(init.called_exactly(2));
    },

    'test that errors are not thrown if no init method is detected': function() {
        assertNoException(function() {
            views({
                test: {}
            });
        });
    },

    'test that views are given a reference to events.dispatch': function() {
        var view = {};

        views({
            test: view
        });

        assertFunction(view.dispatch);

        view.dispatch();
        assertTrue(events.dispatch.called());
    },

    'test that all view methods are assigned as event listeners': function() {
        var first_method = function() {},
            second_method = function() {};

        views({
            test: {
                'first_method': first_method,
                'second_method': second_method
            }
        });

        assertTrue(events.listen.called_exactly(2));
        assertTrue(events.listen.called_with(first_method, second_method));
    },

    'test that view listeners are defined with the view element as the context': function() {
        var mediator = { first_method: function() {} };

        views({
            test: mediator
        });

        assertTrue(events.listen.called_with_exactly('first_method', mediator.first_method, mediator));
    },

    'test that views can define dependencies': function() {
        var mediator = {
            first: {},
            second: {}
        }

        views({
            test: mediator
        });

        assertTrue(dependencies.inject.called_with_exactly(mediator));
    }

});
