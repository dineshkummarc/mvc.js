TestCase('plugins', {

    setUp: function() {
        events = {
            dispatch: xray_specs.stub(),
            listen: xray_specs.stub()
        }

        dependencies = {
            inject: xray_specs.stub(),
            register: xray_specs.stub()
        }

        models = xray_specs.stub();

        plugins = mvc.plugins(events, dependencies, models);
    },

    'test that mvc.plugins is a function': function() {
        assertFunction(mvc.plugins);
    },

    'test that it returns a register function': function() {
        assertFunction(plugins.register);
    },

    'test that it returns an apply function': function() {
        assertFunction(plugins.apply);
    },

    'test that plugins can be registered': function() {
        var url_mapper = xray_specs.stub(),
            url_config = {
                '/': 'start_up'
            };


        plugins.register({
            'urls': url_mapper
        });

        plugins.apply({
            urls: url_config
        });

        assertTrue(url_mapper.called());
        assertTrue(url_mapper.called_with(url_config));
    },

    'test that plugins can dispatch events': function() {
        var url_mapper;

        url_mapper = function() {
            this.dispatch('start_up');
        }

        plugins.register({
            'urls': url_mapper
        });

        plugins.apply({
            urls: {}
        });

        assertTrue(events.dispatch.called());
        assertTrue(events.dispatch.called_with('start_up'));
    },

    'test that plugins can listen for events': function() {
        var url_mapper;

        url_mapper = function() {
            this.listen('start_up', function() {});
        }

        plugins.register({
            'urls': url_mapper
        });

        plugins.apply({
            urls: {}
        });

        assertTrue(events.listen.called());
        assertTrue(events.listen.called_with('start_up'));
    },

    'test that plugins can register dependencies': function() {
        var url_mapper,
            dependency = {};

        url_mapper = function() {
            this.dependencies.register('start_up', dependency);
        }

        plugins.register({
            'urls': url_mapper
        });

        plugins.apply({
            urls: {}
        });

        assertTrue(dependencies.register.called());
        assertTrue(dependencies.register.called_with('start_up', dependency));
    },

    'test that plugins can inject dependencies': function() {
        var url_mapper,
            dependency = {};

        url_mapper = function() {
            this.dependencies.inject('start_up', dependency);
        }

        plugins.register({
            'urls': url_mapper
        });

        plugins.apply({
            urls: {}
        });

        assertTrue(dependencies.inject.called());
        assertTrue(dependencies.inject.called_with('start_up', dependency));
    }

});
