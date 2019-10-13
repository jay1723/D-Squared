etl = require('./etl.js');
etl.createDocIdx().then((idx)=>{
    console.log(idx);
})
