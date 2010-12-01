module NavigationHelpers
    def path_to(page_name)
        case page_name

        when /the hello world page/i
            "http://dev.mvc/examples/hello_world/"

        else
            raise "Can't find mapping from \"#{page_name}\" to a path."
        end
    end
end

World do |world|
    world.extend NavigationHelpers
    world
end
