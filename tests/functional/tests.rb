# TODO: implement less hacky functional tests

require 'rubygems'
require 'safariwatir'

browser = Watir::Safari.new
browser.goto('http://dev.mvc/tests/functional/fixtures/init.html')

tests = []

# View init functions are called with access to element
test_1 = browser.text_field(:name, 'first_field').verify_contains 'View initialised'
tests.push(test_1)

# Models can dispatch events
test_2 = browser.text_field(:name, 'status_field').verify_contains 'Updated status'
tests.push(test_2)

# View methods are assigned as event listeners and can dispatch events
browser.button(:name, 'first_button').click
test_3 = browser.text_field(:name, 'first_field').verify_contains 'I was clicked'
tests.push(test_3)

# Views can define requirements to registered models
test_4 = browser.text_field(:name, 'status_field').verify_contains 'new text'
tests.push(test_4)

# A view mediator should be created for each element found
test_5 = browser.text_field(:name, 'first_view').verify_contains 'Updated'
tests.push(test_5)
test_6 = browser.text_field(:name, 'second_view').verify_contains 'Updated'
tests.push(test_6)

test_7 = browser.text_field(:name, 'third_view').verify_contains 'Updated'
tests.push(test_7)

# Controllers are registered as listeners and can dispatch events
test_8 = browser.text_field(:name, 'second_status_field').verify_contains 'controller updated'
tests.push(test_8)

# Controllers can define and interact with dependencies
test_9 = browser.text_field(:name, 'second_field').verify_contains 'controller'
tests.push(test_9)

# External api can be used to interact with app
browser.button(:name, 'external_button').click
test_10 = browser.text_field(:name, 'first_view').verify_contains 'External update'
tests.push(test_10)

browser.close()

tests.find { |test| 
  if not test
    puts 'failed test ' + test
    return false
  end
}
