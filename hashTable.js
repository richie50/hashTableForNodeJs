/**
 * A simple hash table modified to work with node js , feel free to use this code. 
 * A more suitable solution is to make the hash function less colliding
 * Just playing around with node js concepts , correct me if you spot any mistakes. peace!!!
 */

function HashTable() {
	this.data = new Array(1024);
	this.simpleHash = simpleHash;
	this.simpleDistro = simpleDistro;
	this.insertData = insertData;
}
// a complex robust hash with less collisions might take some to compute ,
// needed callback

function simpleHash(data_) {
	var hashCode = 0;
	if (data_ == undefined)
		return;
	return data_[hashCode].charCodeAt(hashCode);
}
/*I/O , can be inserting into a database , caching maybe , before sending it to db */
function insertData(data , callback) {
	var hash = this.simpleHash(data);
	this.data[hash] = data;
	callback(null , data);
}
/* I/O , this can be query from a database*/
function simpleDistro(callback) {
	for (var j = 0; j < this.data.length; j++) {
		if (this.data[j] != undefined) {
			console.log(j + ": " + this.data[j]);
		}
	}
	callback(null, this.data); // callback in node js
}
/*      TESTING         */

function randString(x) { 
	var s = "";
	while (s.length < x && x > 0) {
		var r = Math.random();
		s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math
				.floor(r * 26)
				+ (r > 0.5 ? 97 : 65)));
	}
	return s;
}
function handle_request(req, res) {
	console.log("REQUEST : " + req.method + " " + req.url);
	var hashTable = new HashTable();
	for (var i = 1; i < 1024; i++) {
		hashTable.insertData(randString(i) , function(err , data){
			if(err){
				console.log("HYPOTHETICAL DATABASE ERROR: " + JSON.stringify(err));
				return;
			}
		});
	}
	hashTable.simpleDistro(function(errorHandle, results) {
		if (errorHandle) {
			res.writeHead(503, {
				"Content-Type" : "application/json"
			});
			console.log("SERVER ERROR: " + JSON.stringify(err));
			return;
		}
		res.writeHead(200, {
			"Content-Type" : "application/json"
		});
		var temp = new Array(1024);
		for (var i = 0; i < results.length; i++) {
			/* filtering the data */
			if (results[i] != null || results[i] != undefined) {
				//console.log(results);
				temp.push(results[i]);
			}
		}
		var out = { // JSON data output format
			status : 200,
			data : {
				temp : temp
			}
		};
		res.end(JSON.stringify(out));
	});
}
console.log("Go to your favourite browser and type in http://localhost:8085");
var http = require('http');
var server = http.createServer(handle_request);
server.listen(8085);
