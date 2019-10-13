etl = require('./etl.js');
etl.createDocIdx().then((idx)=>{
    console.log(JSON.stringify(idx));
})
