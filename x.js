
var fs = require('fs');




console.log("INSERT INTO _testn (d_id, date) VALUES \n")
fs.appendFile('x.txt',"INSERT INTO _testn (d_id, date) VALUES \n", function (err) {
  if (err) throw err;
  console.log('Saved!');
  })

for(var i = 0; i < 1000; i++){
	var d = Math.floor(Math.random() * 10) + 1
	var u = Math.floor(Math.random() * 10) + 1
	fs.appendFile('x.txt', "(\'user"+u+"\', DATE(\'2020-03-"+d+"\')),", function (err) {
  if (err) throw err;
  console.log('Saved!');
}); 
}




// SELECT * FROM _testn WHERE date=(SELECT MIN(NOW() - date) FROM _testn);