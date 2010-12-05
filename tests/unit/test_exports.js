TestCase('exports', {

    setUp: function() {

        events = {
            dispatch: xray_specs.stub(),
            listen: xray_specs.stub()
        }

        exports = mvc.exports(events);

    },

    'test that mvc.exports is a function': function() {
        assertFunction(mvc.exports);
    },

    'test that it returns a register function': function() {
        assertFunction(exports);
    },

    'test that it returns an object': function() {
        var exported = exports({
            first: xray_specs.stub(),
            second: xray_specs.stub()
        });

        assertFunction(exported.first);
        assertFunction(exported.second);
    },

    'test that exported functions can dispatch framework events': function() {
        var exported = exports({
            first: function() {
                this.dispatch();
            }
        });

        exported.first();

        assertTrue(events.dispatch.called());
    },
    
    'test that exported functions can listen for framework events': function() {
        var exported = exports({
            first: function() {
                this.listen();
            }
        });

        exported.first();

        assertTrue(events.listen.called());
    },

    'test that correct parameters are passed': function() {
        var stub = xray_specs.stub();

        var exported = exports({
            first: stub
        });

        exported.first('example');

        assertTrue(stub.called_with('example'));
    }

});
