import pkg from 'shelljs'
const { rm, mv } = pkg
mv('deploy/*.yml', 'build/')
rm('-rf', 'deploy/*')
mv('build/*.yml', 'deploy/')
