const express = require('express');
const path = require('path');
const fs = require("fs");

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client')));

const routesPath = path.join(__dirname, "server/routes/");
fs.readdirSync(routesPath).forEach(file => {
	// ignore swap files
	if (file.startsWith(".")) return;

	console.log(`loading route ${routesPath}/${file}`);
	// eslint-disable-next-line import/no-dynamic-require,global-require
	app.use(require(`${routesPath}/${file}`));
});


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
	res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
