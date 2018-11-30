const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);
console.log(laptopData)


//this will be executed each time when somene access our web-server or our web-page 
const server = http.createServer((req, res) =>{
    //analysisng the  url
    const query = url.parse(req.url, true)
    console.log(query);
    res.writeHead(200, {'Content-type':'text/html'});
    res.end('This is the response')
});

//listening to a specific port and specifuc ip address
//syntax: server.listen(port , ip)
//ip adress  is the address of the system in the network
//port number is the address of the service within the system or a host 
//so the ip and port defgines address of the particular service on the particular system or a host 
//this will be triggererd each time when a aequest is made in dis specific port and specific ip address
//a pair of port number and ip address will define the communication between the server and client
server.listen(1337, '127.0.0.1', () =>{
    console.log('listening for request now');

})


