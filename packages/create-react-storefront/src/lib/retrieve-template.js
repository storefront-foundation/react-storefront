/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
const decompress = require('decompress');
const download = require('download');
const fs = require('fs');
const handleError = require('./handle-error');
const path = require('path');

const downloadedTemplateName = 'react_storefront_template.zip';

const _deleteTemplate = () => {
    try {
        fs.unlinkSync(_getTemplatePath());
    } catch(err) {
        handleError(err, `Compressed template deletion failed. Compressed template is located at ${_getTemplatePath()}`);
    }
};

const _downloadTemplate = async () => {
    const templateUrl = 'https://github.com/moovweb/react-storefront-boilerplate/zipball/master';
    try {
        await download(templateUrl,
            process.cwd(),
            {
                filename: downloadedTemplateName
            }
        );
    } catch(err) {
        handleError(err, 'Error downloading the React Storefront template. Please check your network connection.');
    }
};

const _getTemplatePath = () => {
    return path.resolve(process.cwd(), downloadedTemplateName);
};

const _unzipTemplate = async (targetPath) => {
    try {
        await decompress(_getTemplatePath(), targetPath, {
            strip: 1
        });
    } catch(err) {
        handleError(err, 'Error decompressing the React Storefront template. See error stack above.');
    }
};

/**
 * Downloads the Moov PWA template, decompresses it, and deletes the archive.
 * 
 * @param {string} targetPath The location to decompress the template to.
 */
const retrieveTemplate = async (targetPath) => {
    console.log('Downloading React Storefront template...');
    await _downloadTemplate();
    console.log('Download complete.');

    console.log(`Decompressing React Storefront template to ${targetPath}...`);
    await _unzipTemplate(targetPath);
    console.log('Decompression complete.');

    console.log('Cleaning up...');
    _deleteTemplate();
    console.log('React Storefront template retrieved.');
};

module.exports = {
    _deleteTemplate,
    _downloadTemplate,
    _getTemplatePath,
    _unzipTemplate,
    retrieveTemplate
};
