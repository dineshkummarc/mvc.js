Given 'I am on the hello world page' do 
    @browser.goto 'http://dev.mvc/examples/hello_world/'
end

Then 'I click the submit button' do 
    @browser.button(:name, 'update').click
end
        
When 'I enter Hello world into the message field' do
    @browser.text_field(:name, 'message').set 'Hello world'
end
        
Then 'I should see Hello world on the message display' do
    count = @browser.h1(:class, 'message')
    count.text.should == 'Hello world'
end
