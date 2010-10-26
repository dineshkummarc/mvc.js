
task :create_docs do
  system 'java -jar $JSDOC_TOOLKIT/jsrun.jar $JSDOC_TOOLKIT/app/run.js -a -t=docs/template -d=docs/output src/mvc.js'
end

task :minify do
  system 'java -jar $YUI_COMPRESSOR/build/yuicompressor-2.4.2.jar -o src/mvc.min.js src/mvc.js'
end

task :commit, :message do |t, args|
  system 'git commit -am "' + args[:message] + '"'
  system 'git push origin master'
  
  Rake::Task[:create_gh_page].invoke(args[:message])
end

task :create_gh_page, :message do |t, args|
  puts args[:message]
  
  system 'git checkout gh-pages'
  system 'git checkout master docs/output'
  system 'git commit -am "' + args[:message] + '"'
  system 'git push origin gh-pages'
  system 'git checkout master'
end

task :build, :message do |t, args|
  Rake::Task[:commit].invoke(args[:message])
end