const { calculateReactStorefrontPath } = require('./utils');
const createReactStorefrontInternal = require('./create-react-storefront-internal');
const { promptForConfig } = require('./prompt-for-config');

const _calculateStartCommand = () => {
    if (process.platform === 'win32') {
        return 'npm run start:windows';
    } else {
        return 'npm start';
    }
};

/**
 * The entry point to creating a React Storefront project.
 */
const createReactStorefront = async (options) => {
    let userConfig;

    try {
        userConfig = await promptForConfig(options.configureUpstream);
    } catch(err) {
        console.log(err.message);
        return;
    }

    if (await createReactStorefrontInternal(options, userConfig)) {
        console.log(`\nReact Storefront app created in ${calculateReactStorefrontPath(options.projectName, userConfig)}. Head to that directory and run "${_calculateStartCommand()}" to see it in action!\n`);
    }
};

module.exports = {
    _calculateStartCommand,
    createReactStorefront
};
