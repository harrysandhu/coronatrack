
/*
* Reads in package.json and installs the corresponding 
* typescript dependencies.
*/

var x = require('./package.json')

function exec(cmd, handler = function(error, stdout, stderr){console.log(stdout);if(error !== null){console.log(stderr)}})
{
    const childfork = require('child_process');
    return childfork.exec(cmd, handler);
}

let {dependencies} = x;

for(var d in dependencies){
	if(!d.includes('@types')){
	 exec('npm i -s @types/'+d)

	console.log("Installing: "+ d)
	}
	
}

