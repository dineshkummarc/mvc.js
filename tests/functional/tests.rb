require 'rubygems'
require 'safariwatir'

browser = Watir::Safari.new
browser.goto('http://dev.mvc/tests/functional/fixtures/init.html')

# View init functions are called with access to element
puts browser.text_field(:name, 'first_field').verify_contains 'View initialised'

# Models can dispatch events
puts browser.text_field(:name, 'status_field').verify_contains 'Updated status'

# View methods are assigned as event listeners and can dispatch events
browser.button(:name, 'first_button').click
puts browser.text_field(:name, 'first_field').verify_contains 'I was clicked'

# Views can define requirements to registered models
puts browser.text_field(:name, 'status_field').verify_contains 'new text'

# A view mediator should be created for each element found
puts browser.text_field(:name, 'first_view').verify_contains 'Updated'
puts browser.text_field(:name, 'second_view').verify_contains 'Updated'
puts browser.text_field(:name, 'third_view').verify_contains 'Updated'

# Controllers are registered as listeners and can dispatch events
puts browser.text_field(:name, 'second_status_field').verify_contains 'controller updated'

# Controllers can define and interact with dependencies
puts browser.text_field(:name, 'second_field').verify_contains 'controller'

# External api can be used to interact with app
browser.button(:name, 'external_button').click
puts browser.text_field(:name, 'first_view').verify_contains 'External update'

browser.close()
