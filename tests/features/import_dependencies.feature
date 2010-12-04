Feature: Import dependencies
    In order to develop modular applications
    An import object must be defined
    Which registers applications as submodules

    Scenario: a carousel app is imported into the video player app
        Given I am on the video page
        When I click the next button
        Then The carousel should select it's next item
