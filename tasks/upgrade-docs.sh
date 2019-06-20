#!/usr/bin/env bash

rm -Rf docs;
git clone git@github.com:moovweb/moov-pwa-docs.git docs;
node ./tasks/upgradeDocsVersion;
cd docs;
git config credential.helper 'cache --timeout=120'
git config user.email "bot@circleci.com"
git config user.name "Circle CI Bot"
git add package.json;
git commit -m "RSF Upgrade";
git push;
