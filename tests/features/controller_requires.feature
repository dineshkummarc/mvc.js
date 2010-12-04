Feature: Controller requires
    In order to decouple views and models
    Controllers must be registered
    And be able to interact with models

    Scenario: controller calls a model method
        Given I am on the hello world page
        When I click the add button
        When I click the add button
        When I click the reset button
        Then I should see 0 on the display
