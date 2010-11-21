require 'rubygems'
require 'safariwatir'

browser = Watir::Safari.new
browser.goto('http://dev.mvc/tests/functional/fixtures/view_initialation.html')

# View init functions are called with access to element
puts browser.text_field(:name, 'first_field').verify_contains 'View initialised'

# Models can dispatch events
puts browser.text_field(:name, 'status_field').verify_contains 'Updated status'

# View methods are assigned as event listeners and can dispatch events
browser.button(:name, 'first_button').click
puts browser.text_field(:name, 'first_field').verify_contains 'I was clicked'

# Views can define requirements to registered models
puts browser.text_field(:name, 'status_field').verify_contains 'new text'

# Controllers are registered as listeners and can dispatch events
puts browser.text_field(:name, 'second_status_field').verify_contains 'controller updated'

# Controllers can define and interact with dependencies
puts browser.text_field(:name, 'second_field').verify_contains 'controller'

browser.close()
