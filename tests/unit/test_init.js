TestCase('initialisation', {

    setUp: function() {
        models = mvc.models;
        views = mvc.views;
        controllers = mvc.controllers;
        events = mvc.events;
        dependencies = mvc.dependencies;
        exports = mvc.exports;
        imports = mvc.imports;
        values = mvc.values;

        mvc.models = xray_specs.stub();
        mvc.views = xray_specs.stub();

        mvc.controllers = xray_specs.stub();
        register_controllers = xray_specs.stub();
        mvc.controllers.returns(register_controllers);

        mvc.dependencies = xray_specs.stub();
        mvc.dependencies.returns({});

        mvc.events = xray_specs.stub();
        mvc.events.returns({});

        mvc.imports = xray_specs.stub();

        mvc.exports = xray_specs.stub();
        mvc.exports.returns({});

        mvc.values = xray_specs.stub();
    },

    tearDown: function() {
        mvc.models = models;
        mvc.views = views;
        mvc.controllers = controllers;
        mvc.dependencies = dependencies;
        mvc.events = events;
        mvc.exports = exports;
        mvc.imports = imports;
        mvc.values = values;
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

    /*
     * Models
     *
     */

    'test that models is called with model objects': function() {
        var models = {};

        mvc({
            models: models
        });

        assertTrue(mvc.models.called_with(models));
    },
    
    'test that models is not called if none are defined': function() {
        mvc({
            views: {},
            controllers: {}
        });

        assertFalse(mvc.models.called());
    },
    
    'test that models is called with events': function() {
        var app = mvc({
            models: {}
        });

        assertTrue(mvc.models.called_with(mvc.events()));
    },
    
    'test that models is called with dependencies': function() {
        var app = mvc({
            models: {}
        });

        assertTrue(mvc.models.called_with(mvc.dependencies()));
    },

    /*
     * Views
     *
     */

    'test that views is called with view objects': function() {
        var views = {};

        mvc({
            views: views
        });

        assertTrue(mvc.views.called_with(views));
    },

    'test that views is not called if none are defined': function() {
        mvc({
            models: {},
            controllers: {}
        });

        assertFalse(mvc.views.called());
    },
    
    'test that views is called with events': function() {
        var app = mvc({
            views: {}
        });

        assertTrue(mvc.views.called_with(mvc.events()));
    },
    
    'test that views is called with dependencies': function() {
        var app = mvc({
            views: {}
        });

        assertTrue(mvc.views.called_with(mvc.dependencies()));
    },

    /*
     * Controllers
     *
     */
    
    'test that controllers is called with controller objects': function() {
        var controllers = {};

        mvc({
            controllers: controllers
        });

        assertTrue(register_controllers.called_with(controllers));
    },
    
    'test that controllers is not called if no controllers are defined': function() {
        mvc({
            views: {},
            models: {}
        });

        assertFalse(register_controllers.called());
    },
    
    'test that controllers is called with events': function() {
        var app = mvc({
            controllers: {}
        });

        assertTrue(mvc.controllers.called_with(mvc.events()));
    },
    
    'test that controllers is called with dependencies': function() {
        var app = mvc({
            controllers: {}
        });

        assertTrue(mvc.controllers.called_with(mvc.dependencies()));
    },

    /*
     * Exports
     *
     */

    'test that mvc returns an object if exports is defined': function() {
        var app = mvc({
            exports: {}
        });

        assertEquals(mvc.exports(), app);
    },
    
    'test that exports is called with events': function() {
        var app = mvc({
            exports: {}
        });

        assertTrue(mvc.exports.called_with(mvc.events()));
    },

    'test that exports is called with defined object': function() {
        var exported = {};

        var app = mvc({
            exports: exported
        });

        assertTrue(mvc.exports.called_with(exported));
    },

    'test that exports is not called if none are defined': function() {
        var app = mvc({});

        assertFalse(mvc.exports.called());
        assertUndefined(app);
    },

    /*
     * Imports
     *
     */

    'test that imports is called if an imports object is defined': function() {
        var imports = {};
        var app = mvc({
            imports: imports
        });

        assertTrue(mvc.imports.called());
        assertTrue(mvc.imports.called_with(imports));
    },
    
    'test that imports is not called if an imports object is defined': function() {
        var app = mvc({});

        assertFalse(mvc.imports.called());
    },

    'test that imports is called with the mvc function': function() {
        var app = mvc({
            imports: {}
        });

        assertTrue(mvc.imports.called_with(mvc));
    },

    'test that imports is called with dependencies': function() {
        var app = mvc({
            imports: {}
        });

        assertTrue(mvc.imports.called_with(mvc.dependencies()));
    },

    /*
     * Values
     *
     */

    'test that values is called if defined': function() {
        var values = {};

        var app = mvc({
            values: values
        });

        assertTrue(mvc.values.called());
        assertTrue(mvc.values.called_with(values));
    },

    'test that values is not called if defined': function() {
        var app = mvc({});

        assertFalse(mvc.values.called());
    },

    'test that values is called with dependencies': function() {
        var values = {};

        var app = mvc({
            values: values
        });

        assertTrue(mvc.values.called_with(mvc.dependencies()));
    }

});
