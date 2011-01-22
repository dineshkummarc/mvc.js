Feature: Complete task
    In order to complete tasks
    Users must be able to set tasks as finished
    And see a visual representation to show completed tasks

    Scenario: user clicks the complete button for a task
        Given I am on the todo list page
        When I enter new task into the new task field
        Then I click the submit button
        Then I should see new task in the task list
        Then I click the complete button for new task
        Then I should see new task as completed
