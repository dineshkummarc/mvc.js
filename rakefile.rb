
task :tests do
  system 'java -jar $JSTD_HOME/JsTestDriver-1.2.2.jar --port 3232'
  system 'java -jar $JSTD_HOME/JsTestDriver-1.2.2.jar --tests all --reset'
end

task :doc do
  system 'java -jar $JSDOC_TOOLKIT/jsrun.jar $JSDOC_TOOLKIT/app/run.js -a -t=$JSDOC_TOOLKIT/templates/mvc src/mvc.js -d=docs'
end