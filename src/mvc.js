var mvc = {
    create: function(context) {
        this.events.register('startup_complete');   
        
        context();
        
        this.events.dispatch('startup_complete')
    },
    events: (function() {
        
        var dict = [];
        
        return {
            register: function(event) {
                dict.push(event);
            },
            check: function(event) {
                return dict.indexOf(event) !== -1 ? true : false;
            }
        }
        
    })()
}