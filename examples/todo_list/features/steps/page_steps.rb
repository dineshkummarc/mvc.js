Given 'I am on the todo list page' do 
    @browser.goto 'http://dev.mvc/examples/todo_list/'
end

Then 'I click the submit button' do 
    @browser.link(:id, 'add_task').click
end

Then 'I click the delete button for new task' do 
    @browser.link(:id, 'delete_task').click
end
        
When 'I enter new task into the new task field' do
    @browser.text_field(:name, 'task').set 'new task'
end
        
Then 'I should see new task in the task list' do
    task = @browser.div(:class, 'task_list')ul.li[0]
    task.text.should == 'new task'
end

Then 'I should not see any items in the task list' do
    list = @browser.ul(:id, 'tasks').li
    list.length.should == 0
end

And 'The new task form should be reset' do
    task_field = @browser.text_field(:name, 'task')
    task_field.text.should == ''
end

