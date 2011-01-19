Feature: Message update
    In order to keep messages updated
    Users must be able to send new message alerts

    Scenario: user enters and submits a new message
        Given I am on the hello world page
        When I enter Hello world into the message field
        Then I click the submit button
        Then I should see Hello world on the message display
