var quest = require('hyperquest')
var resolve = require('url').resolve
var join = require('path').join
var concat = require('concat-stream')
var flaggit = require('./flaggit')

module.exports = ticker

function ticker(cb){
  var flagger = flaggit(2, cb)
  quest.get(bcApi('api', 'ticker') + '/').pipe(concat(function(dat){
    dat = JSON.parse(dat.toString())
    dat.type = 'bitcoin'
    flagger(dat)
  })) 
  quest.get(dgApi()).pipe(concat(function(dat){
    dat = JSON.parse(dat.toString())
    var o = {}
    o.type = 'dogecoin'
    o.last = dat.return.markets.DOGE.lasttradeprice
    flagger(o)
  }))
}


function bcApi() {
  return resolve('https://www.bitstamp.net', join.apply(null, arguments))
}

function dgApi() {
  return 'http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=182'
}

