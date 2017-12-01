var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

function getduration(done){
	execute("bash dbus.sh getduration", function(duration){
		done(duration.trim());
	});
}


getduration(duration => console.log(duration));
