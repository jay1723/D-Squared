var request = require('request-promise');
var moment = require('moment');
let bigoloop = function(){
    let j = 0;
    for(i=0; i<50000000;i++){
        j++;
    }
}
exports.transformReport = async function(url){
    return new Promise((resolve,reject) => {
        let doc;
        console.log("https://www.sec.gov/Archives/"+url);
        request.get("https://www.sec.gov/Archives/"+url, (err,res,body) =>{
             let matches = body.match(/<html>[\s\S]*<\/html>/mi);
             doc = matches && matches.length > 0? matches[0]:body;
        }).then(()=>{resolve(doc)});
    });
};
exports.createDocIdx = function(){
    return new Promise((resolve,reject)=>{
        let idx = {};
        let rPath = "Archives/edgar/daily-index/2019/"; //If this ever gets gud change to use current year
        let tickMap = {};
    
        let getIdxForFdate = function(fDateIdx){
            let lines = fDateIdx.split("\n");
            let started = false;
            let i = 0;
            while(!started && i < lines.length){
                if(/-{5,}.*/.test(lines[i])){
                    started = true;
                }
                i++;
            }
            for(let line of lines.slice(i)){
                //CIK|Company Name|Form Type|Date Filed|File Name
                let cols = line.split("|");
                if(tickMap[cols[0]] !== undefined){
                    let ticker = tickMap[cols[0]];
                    let map;
                    let datedEntry = {"date":moment(cols[3], "YYYYMMDD"),"loc":cols[4]};
                    if(idx[ticker] === undefined){
                        map = {};
                        map[cols[2]] = [datedEntry];
                        idx[ticker] = map;
                    }
                    else{
                        map = idx[ticker];
                        if(map[cols[2]] === undefined){
                            map[cols[2]] = [datedEntry];
                        }
                        else{
                            map[cols[2]].push(datedEntry);
                        }
                    }
                }
            }
        }
        
        let getIdxForQtr = function(dirIdx,qtr){
            let idx = JSON.parse(dirIdx);
            let links = [];
            let proms = [];
            for(let item of idx["directory"]["item"]){
                let fname = item["name"];
                if(/master.*\.idx/i.test(fname)){
                    links.push(rPath+qtr+'/'+fname);
                }
            }
            for(let link of links.slice(-2,-1)){
                bigoloop();
                proms.push(request.get("https://www.sec.gov/"+link, (err,res,body) => {
                    getIdxForFdate(body);
                  }));
            }
            return Promise.all(proms);
        };
    
        let getTickers = function(){
            return request.get("https://www.sec.gov/files/company_tickers.json", (err,res,body) => {
            let b = JSON.parse(body);
            let i = 0;
                while(b[String(i)] !== undefined){
                    let cur = b[String(i)];
                    tickMap[cur["cik_str"]] = cur["ticker"];
                    i++;
                }
              });
        }

        
        getTickers().then(() => {
            let proms = [];
            let oproms = [];
            for(let qtr of ["QTR1","QTR2","QTR3","QTR4"]){
                oproms.push(
                    request.get("https://www.sec.gov/"+rPath+qtr+'/index.json', (err,res,body) => {
                        proms.push(getIdxForQtr(body,qtr));
                    }));
            }
            Promise.all(oproms).then(()=>{
                Promise.all(proms).then(()=>{resolve(idx);});
            });
        });
    });

}