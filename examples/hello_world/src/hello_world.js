var hello_world = {

    values: {
        status_element: $('#display_status'),
        form_element: $('#update_status')
    },

    models: {

        status: (function() {

            var current;
                    
            return {
            
                update: function(message) {
                    current = message;

                    this.dispatch('status_updated', [message]);
                },

                current: function() {
                    return current;
                }

            }

        })()

    },

    views: {

        update_form: {

            form_element: '__inject__',
            status: '__inject__',

            init: function() {
                var that = this;

                this.form_element.find('#update').click(function() {
                    var update = that.form_element.find('#message').val();

                    if(update)
                      that.status.update(update);
                });
            }
                     
        },

        status: {
            
            status_element: '__inject__',

            status_updated: function(message) {
                this.status_element.find('h1').html(message);
            }

        }

    }

}

mvc(hello_world);
