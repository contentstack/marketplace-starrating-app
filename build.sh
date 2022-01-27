set -e
#The above command is to fail build if any one of the below build steps fail

rm -rf to-deploy
mkdir to-deploy

#UI Build
cd ui
rm -rf build
rm -rf coverage
npm install
npm run test
npm run build
zip -r ui.zip build/
mv ui.zip ../to-deploy
cd ..
