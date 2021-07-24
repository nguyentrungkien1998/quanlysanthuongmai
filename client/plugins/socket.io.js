import Vue from 'vue'

import sailsIO from 'sails.io.js';
import socketIO from 'socket.io-client';
const io = sailsIO(socketIO)
io.sails.url = 'http://localhost:8080'
Vue.prototype.$socket = io.socket;