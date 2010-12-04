Given 'I am on the hello world page' do 
    @browser.goto 'http://dev.mvc/examples/hello_world/'
end

When 'I click the add button' do 
    @browser.button(:name, 'add').click
end

When 'I click the subtract button' do 
    @browser.button(:name, 'subtract').click
end

When 'I click the reset button' do 
    @browser.button(:name, 'reset').click
end

Then 'I should see 0 on the display' do
    count = @browser.div(:class, 'count')
    count.text.should == '0'
end

Then 'I should see 1 on the display' do
    count = @browser.div(:class, 'count')
    count.text.should == '1'
end

Then 'I should see subtract on the events display' do
    count = @browser.div(:class, 'events')
    count.text.should == 'subtract'
end

Then 'I should see reset on the events display' do
    count = @browser.div(:class, 'events')
    count.text.should == 'reset'
end
