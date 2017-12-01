var nodemiral = require('nodemiral');
var path = require('path');

var session = nodemiral.session('192.168.22.4', { username: 'pi', password: 'jasper90' });
var files_to_copy = ['index.js', 'package.json', 'start_server.sh'];
var remoteLocation = '/home/pi/iplayer-omx/';
var node_bin_folder = '/home/pi/.nvm/versions/node/v6.10.2/bin/';
var node_location = node_bin_folder + 'node';
var yarn_location = node_bin_folder + 'yarn';

console.log('Deploying to ', remoteLocation);

files_to_copy.forEach(function(file) {
	console.log('Copying ', file, '\t ===> ', remoteLocation);
	try {
		session.copy(path.join(__dirname, file), path.join(remoteLocation, file), function(err, code, logs){
			if(err) console.log('ERROR : ', err, '[file:', file,']');
		});
	} catch(ex){
		console.log(ex);
	}
});

session.execute('chmod +x ' + remoteLocation + '/start_server.sh', function(err, code, logs){
	console.log(logs.stdout);
});
// console.log(yarn_location + ' --no-progress --non-interactive --no-emoji --modules-folder ' + remoteLocation + '\n\n');
session.executeScript('start_server.sh', function(err, code, logs){
	console.log(logs.stdout);
});
// session.execute('cd ' + remoteLocation + '; ls -alh', function(err, code, logs){
// 	console.log(logs.stdout);
// });