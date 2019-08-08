const { spawn, execSync } = require('child_process')
const path = require('path')

module.exports = {
  command: 'deploy',
  desc: 'build and deploy your app to the Moovweb XDN',
  builder: yargs => {
    return yargs
      .option('account', {
        alias: 'a',
        describe: 'The name of your account in the Moovweb Control Center',
        default: process.env.moov_account
      })
      .option('project', {
        alias: 'p',
        describe: 'The name of the project in the Moovweb Control Center',
        default: process.env.moov_project
      })
      .option('mode', {
        alias: 'm',
        describe: 'The name of the mode to deploy',
        default: process.env.mode
      })
      .option('email', {
        alias: 'e',
        describe: 'The email address associated with your Moovweb account'
      })
      .option('password', {
        alias: 'p',
        describe: 'The password associated with your Moovweb account'
      })
      .option('token', {
        alias: 't',
        describe: 'Your API token from Moovweb Control Center',
        default: process.env.moov_token
      })
      .option('build-id', {
        alias: 'i',
        describe: 'A CI build ID to which to link the deployment',
        default: process.env.build_id
      })
      .option('deploy-id', {
        alias: 'o',
        describe: 'Specify a deployment identifer, such as a commit message'
      })
      .option('notes', {
        alias: 'n',
        describe: 'Specify optional notes that are attached to this deploy'
      })
      .option('git', {
        describe: 'Link the git sha and commit message to the build in Moovweb Control Center'
      })
  },
  handler: ({ account, project, mode, git, email, password, token, buildId }) => {
    const args = ['deploy', account, project, '--ignore-live']

    if (mode) {
      args.push('--mode', mode, '--create')
    }

    if (email) {
      args.push('--user-email', email)
    }

    if (password) {
      args.push('--user-password', password)
    }

    if (token) {
      args.push('--token', token)
    }

    if (buildId) {
      args.push('--build-id', buildId)
    }

    if (git) {
      args.push(
        `--deploy-id="${execSync('git rev-parse HEAD')
          .toString()
          .trim()}"`
      )
      args.push(
        `--notes="${execSync('git log -1 --pretty=format:%s')
          .toString()
          .replace('"', '"')}"`
      )
    } else {
    }

    const moovsdk = path.join(process.cwd(), 'node_modules', '.bin', 'moovsdk')
    spawn(moovsdk, args, { stdio: [0, 0, 0] })
  }
}
