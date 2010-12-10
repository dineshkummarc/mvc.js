task :create_docs do
  puts 'creating inline docs'
  sh 'java -jar $JSDOC_TOOLKIT/jsrun.jar $JSDOC_TOOLKIT/app/run.js -a -t=docs/template -d=docs/output src/mvc.js'
end

task :minify do
  puts 'minifying javascript'
  sh 'java -jar $YUI_COMPRESSOR/build/yuicompressor-2.4.2.jar -o src/mvc.min.js src/mvc.js'
end

task :unit_tests do
  puts 'running unit tests'
  sh 'java -jar ~/Library/JsTestDriver/JsTestDriver-1.2.2.jar --port 3232 --browser $FIREFOX --tests all --reset' do |ok, res|
    if not ok
      return false
    end
  end
end

task :func_tests do
  puts 'running functional tests'
  sh 'cucumber tests/features/' do |ok, res|
    if not ok
      return false
    end
  end
end

task :commit, :message do |t, args|
  puts 'pusing code to master'
  sh 'git commit -am "' + args.message + '"'
  sh 'git push origin master'
end

task :create_ghpages, :message do |t, args|
  puts 'transfering code to gh-pages'
  sh 'git checkout gh-pages'
  sh 'git checkout master src/'
  sh 'git checkout master docs/'
  sh 'git checkout master examples/'
  sh 'git commit -am "' + args.message + '"'
  sh 'git push origin gh-pages'
  sh 'git checkout master'
end

task :deploy, :message, :needs => [:unit_tests, :create_docs, :minify, :commit, :create_ghpages] do |t, args|
  puts 'deployed'
end
