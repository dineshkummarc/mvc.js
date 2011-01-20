todo_list.controllers = {

    'load_template': {
        command: function(view, dir, file) {
            console.log(view);
            $.ajax({
                url: dir + file,
                success: function(data) {
                    view.template = data;
                }
            });
        }
    }

}
