var webPush = require('web-push');
 
const vapidKeys = {
    "publicKey":"BLov5ynw4BHpSqNOE1f4lzoQUqo7cLhmnzZkNeqcbKWaxNtXYx5wdPUwpuT63jaVyVMCYdLFuVj_kwx8_BL9Vok",
    "privateKey":"0GPIQz3YVE5PcLCEb0ppUFceDnPw_fhJVjGaUrpJZsY"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": " https://fcm.googleapis.com/fcm/send/c-RM_sPdzN4:APA91bESshlW0Z26vNT1jjmiXaXYK1-VOwL2QRUsv9MvNcG96DcmX2JxvMp1qwLyCv7GCCofORVOg_-Z0o1jZKPQLmiBu4VP9-rj_HdR-3E0R_W9RvzF0HlagFaHbQc_Qn16PybwfLpX",
    "keys": {
        "p256dh": "BIXzax4xttFDLQv/+Omsi1KyX2nURfLL1Z224kWs7P1vLPvDD09Z/P/iNfOYD+1decgfdtO4k8DRimlvdzhxHlM=",
        "auth": "hn6hxF0Q5YQSHKTFTwifsw=="
    }
};

var payload = 'Update informasi terkait Laliga Spanyol mulai dari klasemen dan jadwal pertandingan di sini.';
 
var options = {
   gcmAPIKey: '311115009500',
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);