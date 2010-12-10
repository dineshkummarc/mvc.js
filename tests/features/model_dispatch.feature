Feature: Model event dispatch
    In order to maintain state
    A model needs to dispatch events

    Scenario: model method dispatches an event
        Given I am on the hello world page
        When I click the add button
        Then I should see 1 on the display
