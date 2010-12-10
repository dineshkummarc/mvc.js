Feature: Value dependencies
    In order to make system wide changes
    A value object must be defined
    Which can be registered as a dependency

    Scenario: speed value is used to determine transition length
        Given I am on the carousel page
        When I click the next button
        Then After two seconds I should see deerhunter
