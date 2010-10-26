
task :create_docs do
  system 'java -jar $JSDOC_TOOLKIT/jsrun.jar $JSDOC_TOOLKIT/app/run.js -a -t=docs/template -d=docs/output src/mvc.js'
end

task :minify do
  system 'java -jar $YUI_COMPRESSOR/build/yuicompressor-2.4.2.jar -o src/mvc.min.js src/mvc.js'
end

task :create_gh_page do 
  system 'git checkout gh-pages'
  system 'git checkout master docs/output examples'
end

task :default => [:create_docs, :minify, :create_gh_page]