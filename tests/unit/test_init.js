TestCase('initialisation', {

    setUp: function() {
        models = mvc.models;
        views = mvc.views;
        controllers = mvc.controllers;
        events = mvc.events;
        dependencies = mvc.dependencies;

        mvc.models = xray_specs.stub();
        mvc.views = xray_specs.stub();
        mvc.controllers = xray_specs.stub();
        mvc.dependencies = xray_specs.stub();
        mvc.events = xray_specs.stub();
    },

    tearDown: function() {
        mvc.models = models;
        mvc.views = views;
        mvc.controllers = controllers;
        mvc.dependencies = dependencies;
        mvc.events = events;
    },

    'test that mvc is a function': function() {
        assertFunction(mvc);
    },

    'test that an exception is thrown if a config object is not provided': function() {
        assertException(function() {
            mvc();
        });
    },

    'test that events is called': function() {
        mvc({});

        assertTrue(mvc.events.called());
    },

    'test that dependencies is called': function() {
        mvc({});

        assertTrue(mvc.dependencies.called());
    },

    'test that models is called with model objects': function() {
        var models = {};

        mvc({
            models: models
        });

        assertTrue(mvc.models.called_with(models));
    },

    'test that views is called with view objects': function() {
        var views = {};

        mvc({
            views: views
        });

        assertTrue(mvc.views.called_with(views));
    },
    
    'test that controllers is called with controller objects': function() {
        var controllers = {};

        mvc({
            controllers: controllers
        });

        assertTrue(mvc.controllers.called_with(controllers));
    },
    
    'test that models is not called if none are defined': function() {
        mvc({
            views: {},
            controllers: {}
        });

        assertFalse(mvc.models.called());
    },

    'test that views is not called if none are defined': function() {
        mvc({
            models: {},
            controllers: {}
        });

        assertFalse(mvc.views.called());
    },

    'test that controllers is not called if no controllers are defined': function() {
        mvc({
            views: {},
            models: {}
        });

        assertFalse(mvc.controllers.called());
    }

});
