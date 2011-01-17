var hello_world = {

    views: {

        update_form: {

            init: function() {
                var that = this;

                this.element.find('#update').click(function() {
                    that.status.update(that.element.find('#meesage').val());
                });
            }
                     
        }

    }

}

mvc(hello_world);
