const NewsAPI = require('newsapi');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const port = 4000;
app.use(express.json());
const request = require('request');

dotenv.config(); 

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const  iex = require( 'iexcloud_api_wrapper' )
 

// Routes

app.get('/getStockInfo', async function(req, res){
    let result = await history(req.query.ticker);
    res.send(result);
})

app.get('/getSentiment', async function(req, res){
    // console.log(req);
    // let company = req.body.company;
    let company = req.query.company;
    console.log(`getSentiment called with parameter ${company}`);
    let ret = await asyncCall(company);
    console.log(ret);
    res.send(ret);
})

app.get('/getNasdaqTicker', function(req, res){
    const ticker = require('./nasdaq.json');
    res.send(ticker);
})
app.listen(port, () => console.log(`listening on http://localhost:${port}`));


// Helper functions that call APIs
const history = async (sym) => {
    const historyData = await iex.history(sym, {"period": "1y"});
    // do something with returned quote data
    return historyData;
};

function getNewsStories(company){
    return new Promise(resolve => {
        newsapi.v2.everything({
            q: company,
            language: "en",
            sortBy: "top"
        }).then(response => {
            resolve(response);
        })
    })
}
async function asyncCall(company){
    let result = await getNewsStories(company).catch((err) => console.log(err));
    let finalResult = await getSentimentForNewsStories(result).catch((err) => console.log(err));
    return finalResult;
}

function getSentimentForNewsStories(stories){
    return new Promise(resolve => {
        let count = stories.articles.length > 10 ? 10 : stories.articles.length;
        let datastore = [];
        let tmp = count;
        for (let i = 0; i < count; i++){
            let article = stories.articles[i];
            let dataString = 'text=' + article.content;
        
            let options = {
                url: 'http://text-processing.com/api/sentiment/',
                method: 'POST',
                body: dataString
            };
            
            function callback(error, resp, body) {
                if (!error && resp.statusCode == 200) {
                    article.sentiment = resp.body;
                    datastore.push(article);
                    tmp -= 1;
                    if (tmp == 0){
                        resolve(datastore)
                    }
                }
            }
            request(options, callback);
        }
        })
    }