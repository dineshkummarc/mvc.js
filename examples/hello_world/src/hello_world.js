var hello_world = {

    models: {

        status: (function() {

            var current;
                    
            return {
            
                update: function(message) {
                    current = message;

                    this.dispatch('status_updated');
                },

                current: function() {
                    return current;
                }

            }

        })()

    },

    views: {

        update_form: {

            init: function() {
                var that = this;

                this.element.find('#update').click(function() {
                    var update = that.element.find('#message').val();

                    if(update)
                      that.status.update(update);
                });
            }
                     
        }

    }

}

mvc(hello_world);
