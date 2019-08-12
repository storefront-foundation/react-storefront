const { execSync } = require('child_process');
const handleError = require('./handle-error');

/**
 * Installs dependencies using npm.
 * 
 * @param {string} targetPath The project directory to install dependencies in.
 */
const installDependencies = (targetPath) => {
    console.log('Installing dependencies...');

    try {
        execSync('npm install', {
            cwd: targetPath,
            stdio: 'inherit'
        });
    } catch(err) {
        handleError(err, 'An error occurred while installing dependencies.');
    }

    console.log('Dependencies installed successfully.');
};

module.exports = installDependencies;
