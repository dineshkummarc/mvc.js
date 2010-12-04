Feature: View initialisation
    In order to set up initial state
    A views init function should be called automatically

    Scenario: view registered with an init function
        Given I am on the hello world page
        Then I should see 0 on the display
