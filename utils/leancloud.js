// /utils/leancloud.js
import AV from 'leancloud-storage';

// 从环境变量中读取 LeanCloud 配置
const APP_ID = process.env.LEANCLOUD_APP_ID || process.env.leancloud-app-id;
const APP_KEY = process.env.LEANCLOUD_APP_KEY || process.env.leancloud-app-key;

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

export default AV;
