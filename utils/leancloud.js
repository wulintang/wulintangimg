import AV from 'leancloud-storage';

const APP_ID = process.env.LEANCLOUD_APP_ID;
const APP_KEY = process.env.LEANCLOUD_APP_KEY;

console.log('LeanCloud App ID:', APP_ID);
console.log('LeanCloud App Key:', APP_KEY);

AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
});

export default AV;
