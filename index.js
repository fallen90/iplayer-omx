/**
	omxplayer viewer for iplayer
**/
'use strict';
var socket = require('socket.io-client')(process.env.SOCKET_SERVER_URL);
var omx = require('omxctrl');
var moment = require('moment');

var omx_tick = null;

var omx_player = {
	src: "",
	duration: 0,
	position: 0
};


socket.on('connect', function() {
	console.log('Connected to ' + process.env.SOCKET_SERVER_URL);
	socket.emit('announce', 'omx-player-pi');
});

socket.on('disconnect', function() {
	console.log('Disconnected from ' + process.env.SOCKET_SERVER_URL);
});

socket.emit('timeupdate', {
               from : 'iplayer-omx',
               progress : {
                  percent : 0,
                  current_time : 0,
                  duration : player.duration()
               },
               time_sent :  new Date().getTime(),
               playing : {
                  src : player.currentSrc(),
                  type : player.currentType()
               }
            });


socket.on('controller', function(data) {
	console.log('controller', data);
	switch (data.type) {
		case 'seek':
			socket.emit('alert', 'control not supported with current player');
			break;
		case 'brightness':
			socket.emit('alert', 'control not supported with current player');
		case 'control':
			switch (data.value) {
				case 'play':
					omx.play();
					break;
				case 'pause':
					omx.pause();
					break;
				case 'next':
					socket.emit('alert', 'control not supported with current player');
					break;
				case 'refresh':
					socket.emit('alert', 'control not supported with current player');
					break;
				case 'remote_audio':
					socket.emit('alert', 'control not supported with current player');
					break;
				case 'close_browser':
					omx.stop();
					clearInterval(omx_tick);
					break;
			}
			break;
		case 'source_update':
			let src = (data.value.type.includes("mp4")) ? process.env.SOCKET_SERVER_URL + data.value.src : '$(youtube-dl -g "' + data.value.src + '" -f 22)';
			omx_player.src = src;
			omx.play(omx_player.src, [
				'--dbus_name org.mpris.MediaPlayer2.omxplayer',
				'-o hdmi',
				'-b'
			]);
			break;
		default:
			break;
	}
});


function get_duration(socket) {
	let exec = require('child_process').exec;
	let dbus = exec('bash dbus.sh getduration');
	dbus.stdout.on('data', function(data) {
		omx_player.duration = data.trim();
		let msg = {
			from: "",
			progress: {
				percent: 0,
				current_time: 0,
				duration: omx_player.duration
			},
			time_sent: moment().unix(),
			playing: {
				src: omx_player.src,
				type: "omx/media"
			}
		};
		socket.emit('timeupdate', msg);
	});
}

function get_position(socket) {
	let exec = require('child_process').exec;
	let dbus = exec('bash dbus.sh getposition');
	dbus.stdout.on('data', function(data) {
		var percent = (omx_player.position / omx_player.duration) * 100;
		let msg = {
			from: "",
			progress: {
				percent: percent,
				current_time: omx_player.position,
				duration: omx_player.duration
			},
			time_sent: moment().unix(),
			playing: {
				src: omx_player.src,
				type: "omx/media"
			}
		};
		socket.emit('timeupdate', msg);
	});
}
