require 'rubygems'
require 'safariwatir'

Browser = Watir::Safari

# "before all"
browser = Browser.new

Before do
  @browser = browser
end

# "after all"
at_exit do
  browser.close
end
