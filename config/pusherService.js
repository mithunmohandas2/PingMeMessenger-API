const Pusher = require("pusher");

const pusher = new Pusher({
    appId: process.env.pusher_app_id,
    key: process.env.pusher_key,
    secret: process.env.pusher_secret,
    cluster: process.env.pusher_cluster,
    useTLS: true
});

module.exports = {
    pusher,
}