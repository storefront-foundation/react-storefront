rm -Rf docs;
git clone git@github.com:moovweb/moov-pwa-docs.git docs;
node ./tasks/upgradeDocsVersion;
cd docs;
git add package.json;
git commit -m "RSF Upgrade";
git push;
    