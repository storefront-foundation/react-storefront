const { spawn } = require('child_process')
const prompts = require('prompts')
const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const semverPattern = /^((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/gm
const chalk = require('chalk')

function validateVersion(version) {
  if (semverPattern.test(version)) {
    return true
  } else {
    return 'Version must be in valid semver format'
  }
}

async function build() {
  const twaPath = path.join(process.cwd(), 'twa')
  const buildConfigPath = path.join(twaPath, 'app', 'build.gradle')
  const buildConfig = readFileSync(buildConfigPath, 'utf8')
  const versionCodePattern = /versionCode (\d+)/
  const versionNamePattern = /versionName "([^"]+)"/
  const versionCode = buildConfig.match(versionCodePattern)[1]
  const currentVersion = buildConfig.match(versionNamePattern)[1]

  console.log(`Current version: ${chalk.green(currentVersion)}`)

  const answers = await prompts([
    {
      name: 'newVersion',
      type: 'text',
      message: 'New version',
      initial: currentVersion,
      validate: validateVersion,
      active: 'yes',
      inactive: 'no',
    },
  ])

  const newBuildConfig = buildConfig
    .replace(
      versionCodePattern,
      `versionCode ${answers.newVersion === currentVersion ? versionCode : versionCode + 1}`,
    )
    .replace(versionNamePattern, `versionName "${answers.newVersion}"`)

  writeFileSync(buildConfigPath, newBuildConfig, 'utf8')

  const gradle = spawn(path.join(twaPath, 'gradlew'), [':app:buildRelease'], {
    cwd: twaPath,
    stdio: 'inherit',
  })

  gradle.on('error', error => console.log(chalk.red(error)))

  gradle.on('exit', function(code) {
    if (code === 0) {
      console.log('\n')
      console.log('Build written to ' + chalk.green('twa/build/outputs/bundle/release/app.aab'))
      console.log('\n')
    }
  })
}

build()
