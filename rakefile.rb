
task :create_docs do
  system 'java -jar $JSDOC_TOOLKIT/jsrun.jar $JSDOC_TOOLKIT/app/run.js -a -t=docs/template -d=docs/output src/mvc.js'
end

task :minify do
  system 'java -jar $YUI_COMPRESSOR/build/yuicompressor-2.4.2.jar -o src/mvc.min.js src/mvc.js'
end

task :commit do |message|
  puts message
  
  system 'git commit -am "testing rake build commit"'
  system 'git push origin master'
end

task :create_gh_page do |message|
  puts message
  
  system 'git checkout gh-pages'
  system 'git checkout master docs/output examples'
  system 'git commit -am "testing rake build commit"'
  system 'git push origin gh-pages'
  system 'git checkout master'
end

task :build, :commit_message do |t, args|
  Rake::Task[:commit].invoke(args[:commit_message])
  Rake::Task[:create_gh_page].invoke(args[:commit_message])
end