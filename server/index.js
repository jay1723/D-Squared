const NewsAPI = require('newsapi');
const dotenv = require('dotenv');
dotenv.config(); 
// console.log(process.env.NEWS_API_KEY);
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
let datastore;

function test(response){
    
}

newsapi.v2.everything({
    q: 'Microsoft stock',
    language: 'en'
  }).then(response => {
    // console.log(response);
    
  });

// console.log("Hello world");