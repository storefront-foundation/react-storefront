/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
const { calculateReactStorefrontPath } = require('./utils');
const installDependencies = require('./install-dependencies');
const { isTargetPathValid } = require('./input-validation');
const { processReactStorefrontConfigJsons, processPackageJson } = require('./template-processing');
const { retrieveTemplate } = require('./retrieve-template');

/**
 * Create the React Storefront with the user's selected options.
 * 
 * @param {Object} options The user's command-line options.
 * @param {Object} userConfig The user's selected configuration options.
 */
const createReactStorefrontInternal = async (options, userConfig) => {
    const targetPath = calculateReactStorefrontPath(options.projectName, userConfig);

    if (userConfig.createDirectory && !isTargetPathValid(targetPath)) {
        console.log(`The specified path ("${targetPath}") exists and is not an empty directory. Please move it or try another path.`);
        return false;
    }

    await retrieveTemplate(targetPath);
    processPackageJson(options.projectName, targetPath, userConfig);

    if (options.configureUpstream) {
        processReactStorefrontConfigJsons(targetPath, userConfig);
    }

    installDependencies(targetPath);
    return true;
};

module.exports = createReactStorefrontInternal;
