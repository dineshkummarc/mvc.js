Given 'I am on the hello world page' do 
    @browser.goto 'http://dev.mvc/examples/hello_world/'
end

Then 'I should see 0 on the display' do
    @browser.div(:class, 'count').text
end
