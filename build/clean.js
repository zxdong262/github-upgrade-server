const { rm, mv } = require('shelljs')

mv('deploy/*.yml', 'build/')
rm('-rf', 'deploy/*')
mv('build/*.yml', 'deploy/')
