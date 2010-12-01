Feature: View initialisation

    Scenario: views are registered with an init function
        Given I am on the hello world page
        Then I verify the page contains the text "view initialised"
