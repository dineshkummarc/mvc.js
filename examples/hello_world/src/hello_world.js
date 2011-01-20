var hello_world = {

    config: {
        status_element: $('#display_status h1'),
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
                var that, $message_field, $update;

                that = this;
                $message_field = this.form_element.find('#message');
                $update = this.form_element.find('#update');

                $update.click(function() {
                    var status_update = $message_field.val();

                    if(status_update)
                      that.status.update(status_update);

                    return false;
                });
            }
                     
        },

        status_display: {
            
            status_element: '__inject__',

            status_updated: function(message) {
                this.status_element.html(message);
            }

        }

    }

}

mvc(hello_world);
