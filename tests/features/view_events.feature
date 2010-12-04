Feature: View events
    In order to change state
    A view needs to dispatch events

    Scenario: view method dispatches an event
        Given I am on the hello world page
        When I click the subtract button
        Then I should see subtract on the events display
