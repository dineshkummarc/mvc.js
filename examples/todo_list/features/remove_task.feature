Feature: Remove task
    In order to remove tasks
    Users must be able to delete tasks

    Scenario: user clicks the delete button for a task
        Given I am on the todo list page
        When I enter new task into the new task field
        Then I click the submit button
        Then I should see new task in the task list
        Then I click the delete button for new task
        Then I should not see any items in the task list
