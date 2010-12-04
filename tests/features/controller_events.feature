Feature: Controller events
    In order to decouple views and models
    Controllers must be registered
    And be able to dispatch and listen for events

    Scenario: controller dispatches an event
        Given I am on the hello world page
        When I click the reset button
        Then I should see reset on the events display
