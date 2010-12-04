Given 'I am on the hello world page' do 
    @browser.goto 'http://dev.mvc/examples/hello_world/'
end

Then 'I should see 0 on the display' do
    count = @browser.div(:class, 'count')
    count.text.should == '0'
end

When 'I click the add button' do 
    @browser.button(:name, 'add').click
end

Then 'I should see 1 on the display' do
    count = @browser.div(:class, 'count')
    count.text.should == '1'
end
