task :create_docs do
  puts 'creating inline docs'
  system 'java -jar $JSDOC_TOOLKIT/jsrun.jar $JSDOC_TOOLKIT/app/run.js -a -t=docs/template -d=docs/output src/mvc.js'
end

task :minify do
  puts 'minifying javascript'
  system 'java -jar /Library/YUI_Compressor/yuicompressor-2.4.2.jar -o src/mvc.min.js src/mvc.js'
end

task :jstest do
  puts 'running unit tests'
  system 'java -jar ~/Library/JsTestDriver/JsTestDriver-1.2.2.jar --port 3232'
  system 'java -jar ~/Library/JsTestDriver/JsTestDriver-1.2.2.jar --tests all --reset'
end

task :commit, :message do |t, args|
  puts 'pusing code to master'
  system 'git commit -am "' + args.message + '"'
  system 'git push origin master'
end

task :create_ghpages, :message do |t, args|
  puts 'transfering code to gh-pages'
  system 'git checkout gh-pages'
  system 'git checkout master docs/output'
  system 'git commit -am "' + args.message + '"'
  system 'git push origin gh-pages'
  system 'git checkout master'
end

task :deploy, :message, :needs => [:create_docs, :minify, :commit, :create_ghpages] do |t, args|
  puts 'deployed'
end
