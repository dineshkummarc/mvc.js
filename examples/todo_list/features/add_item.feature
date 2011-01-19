Feature: Add task
    In order to add new tasks
    Users must be able to submit a todo task form
    Which adds the task to the current task list

    Scenario: user enters task title to form and then clicks submit
        Given I am on the todo list page
        When I enter new task into the new task field
        Then I click the submit button
        Then I should see new task in the task list
        And The new task form should be reset
