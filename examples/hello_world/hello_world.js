var hello_world = {

    values: {
        count_view: $('.wrapper .count'),
        events_view: $('.wrapper .events'),
        reset_view: $('.wrapper #reset'),
        subtract_view: $('.wrapper #subtract'),
        add_view: $('.wrapper #add')
    },

    models: {

        'count': (function() {
            var current_count;

            return {
                init: function() {
                    current_count = 0;
                },
                
                add: function() {
                    current_count++;
                    
                    this.dispatch('number_changed', [current_count]);
                },
                
                subtract: function() {
                    current_count--;
                    
                    this.dispatch('number_changed', [current_count]);
                },

                reset: function() {
                   current_count = 0;

                   this.dispatch('number_changed', [current_count]);
                }
            }
        })()

    },

    views: {

        'display': {
            count_view: '__inject__',

            init: function() {
                this.count_view.html('0');
            },
            
            number_changed: function(number) {
                this.count_view.html(number);
            }
        },

        'events': {
            events_view: '__inject__',

            update_action: function(action) {
                this.events_view.html(action);
            }
        },
        
        'add': {
            add_view: '__inject__',
            count: '__inject__',

            init: function() {
                var that = this;
                
                this.add_view.click(function() {
                    that.count.add();
                });
            }
        },
        
        'subtract': {
            subtract_view: '__inject__',
            count: '__inject__',

            init: function() {
                var that = this;
                
                this.subtract_view.click(function() {
                    that.count.subtract();
                    that.dispatch('update_action', ['subtract']);
                });
            }
        },

        'reset': {
            reset_view: '__inject__',

            init: function() {
                var that = this;
                
                this.reset_view.click(function() {
                    that.dispatch('reset');
                });
            }
        }

    },

    controllers: {

        'reset': {
            count: '__inject__',
            command: function() {
                this.count.reset();
                this.dispatch('update_action', ['reset']);
            }
        }
    
    }
}

var my_app = mvc(hello_world);
