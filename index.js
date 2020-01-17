const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');
const util = require('util');
const htmlAsync = util.promisify(fs.writeFile);
var pdf = require('html-pdf');
var options = { format: 'Letter' };
const colors = {
	green: {
		wrapperBackground: '#E6E1C3',
		headerBackground: '#C1C72C',
		headerColor: 'black',
		photoBorderColor: '#black'
	},
	blue: {
		wrapperBackground: '#5F64D3',
		headerBackground: '#26175A',
		headerColor: 'white',
		photoBorderColor: '#73448C'
	},
	pink: {
		wrapperBackground: '#879CDF',
		headerBackground: '#FF8374',
		headerColor: 'white',
		photoBorderColor: '#FEE24C'
	},
	red: {
		wrapperBackground: '#DE9967',
		headerBackground: '#870603',
		headerColor: 'white',
		photoBorderColor: 'white'
	}
};

inquirer
	.prompt([
		{
			type: 'list',
			message: 'What is your favorite color?',
			choices: ['green', 'blue', 'pink', 'red'],
			name: 'color'
		},
		{
			type: 'input',
			message: 'What is your GitHub repo name?',
			name: 'repo'
		}
	])
	.then((response) => {
		//console.log('response ', response);
		const color = colors[response.color];
		githubUN(color, response.repo);

		//writeToFile(response.color);

		//const userName = response.repo;
		//console.log(userName);

		// htmlAsync('index.html', repoData).catch((e) => {
		// 	console.log('ERROR', e);
		// });
	});

function githubUN(color, userName) {
	const queryUrl = `https://api.github.com/users/${userName}`;

	axios
		.get(queryUrl)
		.then((githubData) => {
			console.log('data: ', githubData.data);

			const queryUrlStars = `https://api.github.com/users/${userName}/repos`;
			axios.get(queryUrlStars).then((githubStars) => {
				let stars = 0;
				for (let i = 0; i < githubStars.data.length; i++) {
					stars = stars + githubStars.data[i].stargazers_count;
				}

				var html = writeToFile(stars, color, githubData.data);
				console.log(html);
				htmlAsync('index.html', html).catch((e) => {
					console.log('ERROR', e);
				});

				pdf
					.create(html, options)
					.toFile('./developerProfile.pdf', function(err, res) {
						if (err) return console.log(err);
						console.log(res); // { filename: '/app/businesscard.pdf' }
					});
			});
		})
		.catch((error) => {
			console.log(error);
		});
}

function writeToFile(stars, color, data) {
	console.log('color', color);
	return `<!DOCTYPE html>
      <html lang="en">
         <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
            <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
            <title>Document</title>
            <style>
                @page {
                  margin: 0;
                }
               *,
               *::after,
               *::before {
               box-sizing: border-box;
               }
               html, body {
               padding: 0;
               margin: 0;
               }
               html, body, .wrapper {
               height: 100%;
               }
               .wrapper {
               background-color: ${color.wrapperBackground};
               padding-top: 100px;
               }
               body {
               background-color: white;
               -webkit-print-color-adjust: exact !important;
               font-family: 'Cabin', sans-serif;
               }
               main {
               background-color: #E9EDEE;
               height: auto;
               padding-top: 30px;
               }
               h1, h2, h3, h4, h5, h6 {
               font-family: 'BioRhyme', serif;
               margin: 0;
               }
               h1 {
               font-size: 3em;
               }
               h2 {
               font-size: 2.5em;
               }
               h3 {
               font-size: 2em;
               }
               h4 {
               font-size: 1.5em;
               }
               h5 {
               font-size: 1.3em;
               }
               h6 {
               font-size: 1.2em;
               }
               .photo-header {
               position: relative;
               margin: 0 auto;
               margin-bottom: -50px;
               display: flex;
               justify-content: center;
               flex-wrap: wrap;
               background-color: ${color.headerBackground};
               color: ${color.headerColor};
               padding: 10px;
               width: 95%;
               border-radius: 6px;
               }
               .photo-header img {
               width: 250px;
               height: 250px;
               border-radius: 50%;
               object-fit: cover;
               margin-top: -75px;
               border: 6px solid ${color.photoBorderColor};
               box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
               }
               .photo-header h1, .photo-header h2 {
               width: 100%;
               text-align: center;
               }
               .photo-header h1 {
               margin-top: 10px;
               }
               .links-nav {
               width: 100%;
               text-align: center;
               padding: 20px 0;
               font-size: 1.1em;
               }
               .nav-link {
               display: inline-block;
               margin: 5px 10px;
               }
               .workExp-date {
               font-style: italic;
               font-size: .7em;
               text-align: right;
               margin-top: 10px;
               }
               .container {
               padding: 50px;
               padding-left: 100px;
               padding-right: 100px;
               }
      
               .row {
                 display: flex;
                 flex-wrap: wrap;
                 justify-content: space-between;
                 margin-top: 20px;
                 margin-bottom: 20px;
               }
      
               .card {
                 padding: 20px;
                 border-radius: 6px;
                 background-color: ${color.headerBackground};
                 color: ${color.headerColor};
                 margin: 20px;
               }
               
               .col {
               flex: 1;
               text-align: center;
               }
      
               a, a:hover {
               text-decoration: none;
               color: inherit;
               font-weight: bold;
               }
      
               @media print { 
                body { 
                  zoom: .75; 
                } 
               }
            </style>
            <body>
      <div class="wrapper">
         <div class="photo-header">
            <img src="${data.avatar_url}" alt="Photo of ${data.name}" />
            <h1>Hi!</h1>
            <h2>
            My name is ${data.name}!</h1>
            <h5>${data.name}</h5>
            <nav class="links-nav">
               <a class="nav-link" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/${data.location}"><i class="fas fa-location-arrow"></i> ${data.location}</a>
               <a class="nav-link" target="_blank" rel="noopener noreferrer" href="${data.html_url}"><i class="fab fa-github-alt"></i> GitHub</a>
              <a class="nav-link" target="_blank" rel="noopener noreferrer" href="${data.blog}"><i class="fas fa-rss"></i> Blog</a>
            </nav>
         </div>
         <main>
            <div class="container">
            <div class="row">
               <div class="col">
                  <h3>${data.bio}</h3>
               </div>
            </div>
               <div class="row">
                <div class="col">
                    <div class="card">
                      <h3>Public Repositories</h3>
                      <h4>${data.public_repos}</h4>
                    </div>
                </div>
                <div class="col">
                  <div class="card">
                    <h3>Followers</h3>
                    <h4>${data.followers}</h4>
                  </div>
               </div>
               </div>
               <div class="row">
               <div class="col">
               <div class="card">
                  <h3>GitHub Stars</h3>
                  <h4>${stars}</h4>
                  </div>
               </div>
                <div class="col">
                <div class="card">
                  <h3>Following</h3>
                  <h4>${data.following}</h4>
                  </div>
               </div>
               </div>
            </div>
         </main>
      </div>
   </body>`;
}
