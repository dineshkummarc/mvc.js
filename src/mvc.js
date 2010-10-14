var mvc = {
    create: function(context) {
        this.events.register('startup_complete');   
        
        context();
        
        this.events.dispatch('startup_complete')
    }
}