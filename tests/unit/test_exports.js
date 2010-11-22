TestCase('exports', {

    setUp: function() {

        events = {
            dispatch: xray_specs.stub(),
            listen: xray_specs.stub()
        }

    },

    'test that mvc.exports is a function': function() {
        assertFunction(mvc.exports);
    },

    'test that it returns an object': function() {
        var exported = mvc.exports({
            first: xray_specs.stub(),
            second: xray_specs.stub()
        }, events);

        assertFunction(exported.first);
        assertFunction(exported.second);
    },

    'test that exported functions can dispatch framework events': function() {
        var exported = mvc.exports({
            first: function() {
                this.dispatch();
            }
        }, events);

        exported.first();

        assertTrue(events.dispatch.called());
    },
    
    'test that exported functions can listen for framework events': function() {
        var exported = mvc.exports({
            first: function() {
                this.listen();
            }
        }, events);

        exported.first();

        assertTrue(events.listen.called());
    },

    'test that correct parameters are passed': function() {
        var stub = xray_specs.stub();

        var exported = mvc.exports({
            first: stub
        }, events);

        exported.first('example');

        assertTrue(stub.called_with('example'));
    }

});
