require 'rubygems'
require 'firewatir'

Browser = FireWatir::Firefox

# "before all"
browser = Browser.new

Before do
  @browser = browser
end

# "after all"
at_exit do
  browser.close
end
