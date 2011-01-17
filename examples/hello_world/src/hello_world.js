var hello_world = {

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
