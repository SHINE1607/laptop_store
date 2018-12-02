const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);



//this will be executed each time when somene access our web-server or our web-page 
const server = http.createServer((req, res) => {
    //analysisng the  url or called routing 
    //url module should be called each timne when someone access the server
    //here we are using the url module is used to get the pathname and the query  of the webpage / server

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;


    console.log(pathName);

    //here  we r taking different cases of routinf 

    //PRODUCT OVERVIEW  
    if (pathName === `/products` || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        //here we are using the first the whole data as cards through template-card.html
        fs.readFile(`${__dirname}/template/template-overview.html`, 'utf-8', (err, data) => {
            //here we are using  this functyion is looped to model each card
            //here we are storinthe the template-overview.html file to overviewOutput
            let overviewOutput = data;
            fs.readFile(`${__dirname}/template/template-card.html`, 'utf-8', (err, data) => {
                //here we are using map function to loop thorugh the laptopData retrieved from the json file
                //here we are creating a string joined by the iterating through the laptopData array 
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                //here we are replacing the '${%CARDS%}' placeholder in the overviewOutput by the  cardsOutput
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                
                res.end(overviewOutput);
                
                
    
            });
    

        });



    //LAPTOP  INFO
    } else if (pathName === '/laptop' && id < laptopData.length) {
        //here we are using the fs.readFile() funcytion to read the template-laptop.html file to replace all the placeholders with the data coming form the json file 
        res.writeHead(200, { 'Content-type': 'text/html' })
        //here we are not using readFile sync fucncytion because, since it is a synchroous fuction it will block the exceution of all the users eho are using the server the same time 
        //here this
        fs.readFile(`${__dirname}/template/template-laptop.html`, 'utf-8', (err, data) => {
            //storing the crrently slected laptop id to laptop variable 
            const laptop = laptopData[id];
            //output is made let because its data is changed whenn each latop is selected
            //here we are using strings are written in regular expressions

            //regulsr expressions are used for representing a set of string in an algaebraic fashion
            //=> including all the aphabest symbols including ^, ∅ are also regular expressions
            //=> if R1 andR2 are regular expresion, then R1+R2 is also a aregular expression
            //=> if R1 andR2 are regular expresion, then R1R2 is also a aregular expression
            //=> if R is argular expression then ots clodure will also be regular expression

            //calling the output replace Template function to replace all the placeholders 
            let output = replaceTemplate(data, laptop);
            res.end(output);

        });
    
    }
    //IMAGE ROUTERS
    //here we are using the  simply the condition  for image request as reguar expression
    else if(( /\.(jpe?g|png|gif|bmp)$/i.test(pathName) )) {
        //here we are replacing the image placeholders with th images from the database
        
        
        fs.readFile(`${__dirname}/data/img${pathName}`,  (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpeg' });
            res.end(data);
        });
    }

    //case fpr url not found
     else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('url not Found!! ');
    }


});


//listening to a specific port and specifuc ip address
//syntax: server.listen(port , ip)
//ip adress  is the address of the system in the network
//port number is the address of the service within the system or a host 
//so the ip and port defgines address of the particular service on the particular system or a host 
//this will be triggererd each time when a aequest is made in dis specific port and specific ip address
//a pair of port number and ip address will define the communication between the server and client
server.listen(1337, '127.0.0.1', () => {
    console.log('listening for request now');

})
//just simply creating a function to replace all the place holders with the needed data
function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}

/*in mode js the concept of folders doesnt exist, everything is accessed through request from the server,
===> here we pathnam eis called routers
===> therfore '/laptops' and '/products' are tow routers we requested  for but we never requested for images
===>  because images are quested as src link, so node tries to access it as http request and not from folder*/