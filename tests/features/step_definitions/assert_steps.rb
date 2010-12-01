Given /I verify the page contains the text "(.*)"/ do |text|
    assert(@browser.contains_text(text))
end
