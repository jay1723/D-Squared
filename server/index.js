const NewsAPI = require('newsapi');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const port = 4000;
app.use(express.json());
const request = require('request');
const etl = require('./etl.js');


dotenv.config(); 

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const  iex = require( 'iexcloud_api_wrapper' )
 

//Big ol index
let idx;
// Routes

app.get('/secforms', async function(req,res){
    if(idx === undefined){
        idx = await etl.createDocIdx();
    }
    let ticker = req.query.ticker;
    if(ticker === undefined){
        res.status(400).send({
            message: 'Please provide a ticker'
         });
         return;
    }
    let filings = idx[ticker];
    if(filings === undefined){
        res.send({});
        return
    }
    res.send(filings);
});

app.get('/filing', async function(req,res){
    let url = req.query.url;
    if(url === undefined){
        res.status(400).send({
            message: 'Please provide a url for a filing'
         });
         return;
    }
    let page = await etl.transformReport(url);
    // console.log(page);
    res.send(page);
});

app.get('/getStockInfo', async function(req, res){
    let result = await history(req.query.ticker);
    res.send(result);
})

app.get('/getSentiment', async function(req, res){
    console.log(req);
    // let company = req.body.company;
    let company = req.query.company;
    console.log(`getSentiment called with parameter ${company}`);
    let ret = await asyncCall(company);
    console.log('return', ret); 
    res.send(ret);
})

app.get('/getNasdaqTicker', function(req, res){
    const ticker = require('./nasdaq.json');
    res.send(ticker);
})
app.listen(port, () => console.log(`listening on http://localhost:${port}`));


// Helper functions that call APIs
const history = async (sym) => {
    const historyData = await iex.history(sym, {"period": "3m"});
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
    try {
        let result = await getNewsStories(company).catch((err) => console.log(err));
        let finalResult = await getSentimentForNewsStories(result).catch((err) => console.log('err:', err));
        return finalResult;
    } catch(err) {
        return []; 
    }
}

function getSentimentForNewsStories(stories) {

    return new Promise((resolve, reject) => {
        let count = stories.articles.length > 10 ? 10 : stories.articles.length;
        if (count === 0){
            resolve([]);
            return; 
        }
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
                if (error || resp.statusCode != 200) {
                    reject(); 
                }
                article.sentiment = resp.body;
                datastore.push(article);
                tmp -= 1;
                if (tmp == 0){
                    resolve(datastore)
                }
            }
            request(options, callback);
        }
    });

}