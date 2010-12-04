Feature: Exports API
    In order to interact with the application
    From outside of the source code
    An external API must be defined

    Scenario: application exports an api
        Given I am on the carousel page
        When I click the next button
        Then After two seconds I should see deerhunter
