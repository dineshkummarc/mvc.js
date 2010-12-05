TestCase('plugibs', {

    setUp: function() {
        events = {
            dispatch: xray_specs.stub(),
            listen: xray_specs.stub()
        }

        dependencies = {
            inject: xray_specs.stub(),
            register: xray_specs.stub()
        }

        plugins = mvc.plugins(events, dependencies);
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
    }

});
