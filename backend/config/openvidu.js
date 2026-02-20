const { OpenVidu } = require('openvidu-node-client');

const OPENVIDU_URL = process.env.OPENVIDU_URL || 'https://localhost:4443';
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';

const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

module.exports = openvidu;
