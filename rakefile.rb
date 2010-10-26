commit_message = 'not defined'

task :create_docs do
  system 'java -jar $JSDOC_TOOLKIT/jsrun.jar $JSDOC_TOOLKIT/app/run.js -a -t=docs/template -d=docs/output src/mvc.js'
  
  Rake::Task[:minify].invoke()
end

task :minify do
  system 'java -jar $YUI_COMPRESSOR/build/yuicompressor-2.4.2.jar -o src/mvc.min.js src/mvc.js'
  
  Rake::Task[:commit].invoke()
end

task :commit do
  system 'git commit -am "' + commit_message + '"'
  system 'git push origin master'
  
  Rake::Task[:create_gh_page].invoke()
end

task :create_gh_page do
  system 'git checkout gh-pages'
  system 'git checkout master docs/output'
  system 'git commit -am "' + commit_message + '"'
  system 'git push origin gh-pages'
  system 'git checkout master'
end

task :deploy, :message do |t, args|
  commit_message = args[:message]
  
  Rake::Task[:create_docs].invoke()
end