Feature: Plugins
    In order to create a custom API
    A plugins object needs to be defined
    That can create new options within the config object

    Scenario: url plugin added to config
        Given I am on the video page
        When I change the url to play
        Then I should see the video playing
