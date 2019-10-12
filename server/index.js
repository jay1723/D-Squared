const NewsAPI = require('newsapi');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const port = 4000;
app.use(express.json())
const request = require('request');

dotenv.config(); 

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

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
    // console.log(result);
    let finalResult = await getSentimentForNewsStories(result).catch((err) => console.log(err));
    // console.log(finalResult);
    return finalResult;
}
app.get('/getSentiment', async function(req, res){
    // console.log(req);
    console.log(`getSentiment called with parameter ${req.body.company}`);
    let company = req.body.company;
    let ret = await asyncCall(company);
    console.log(ret);
    res.send(ret);
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`));

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