import { rm, mv } from 'shelljs'

mv('deploy/*.yml', 'build/')
rm('-rf', 'deploy/*')
mv('build/*.yml', 'deploy/')
