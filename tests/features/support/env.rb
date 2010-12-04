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

class Watir::Element

  # If any parent element isn't visible then we cannot write to the
  # element. The only realiable way to determine this is to iterate
  # up the DOM element tree checking every element to make sure it's
  # visible.
  def visible?
    # Now iterate up the DOM element tree and return false if any
    # parent element isn't visible or is disabled.
    object = document
    while object
      begin
        if object.style.invoke('visibility') =~ /^hidden$/i
          return false
        end
        if object.style.invoke('display') =~ /^none$/i
          return false
        end
        if object.invoke('isDisabled')
          return false
        end
      rescue WIN32OLERuntimeError
      end
      object = object.parentElement
    end
    true
  end
end
