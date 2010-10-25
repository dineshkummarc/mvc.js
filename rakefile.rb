
task :doc do
  system 'java -jar $JSDOC_TOOLKIT/jsrun.jar $JSDOC_TOOLKIT/app/run.js -a -t=$JSDOC_TOOLKIT/templates/mvc src/mvc.js -d=docs'
end