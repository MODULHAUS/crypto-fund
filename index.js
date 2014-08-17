var quest = require('hyperquest')
var resolve = require('url').resolve
var join = require('path').join
var concat = require('concat-stream')
var flaggit = require('./flaggit')
var ticker = require('./ticker')
var cache = {}
var lastKnown = {}
var convert = {}

ticker(gotTicker)

setInterval(function(){
  ticker(gotTicker)
}, 1000 * 60 * 60 * 12)

var $ = module.exports

$.total = function(wallets, cb){
  var flag = wallets.length 
  
  var _cb = function(err, data){
    
    data = data.reduce(function(p,e){
      return p + e.toUSD
    }, 0)

    cb(err, data)
  
  }

  var flagger = flaggit(flag, _cb)

  wallets.forEach(function(wallet){
    var h;
    var w = cache[wallet.address]
    if(w && w.cached) {
      flagger(wallet)
    }
    else{
      if(wallet.type.toLowerCase() == 'dogecoin'){
        h = quest.get(dgApi('api', 'v1', 'address', 'received', wallet.address))
        h.pipe(concat(function(data){
          data = JSON.parse(data.toString())
          var r = wallet.received = Number(data.received)
          wallet.cached = true
          wallet.timeout = setTimeout(function(){
            wallet.cached = false
          }, 2000)
          wallet.toUSD = r * convert[wallet.type].last
          cache[wallet.address] = wallet
          flagger(wallet)
        }))
        }
      else{
        h = quest.get(bcApi('q', 'getreceivedbyaddress', wallet.address))
        h.pipe(concat(function(data){
          var r = wallet.received = Number(data.toString())
          wallet.cached = true
          wallet.timeout = setTimeout(function(){
            wallet.cached = false
          }, 2000)
          wallet.toUSD = r * convert[wallet.type].last
          cache[wallet.address] = wallet
          flagger(wallet)
        }))
      }
      h.on('error', function(err){
        cb('error', err, null)
      })
    }
  })
}

function gotTicker (err, data){
  if(err) console.log(error)
  else{
    data.forEach(function(e){
      var x = convert[e.type] = {}
      x.last = e.last
      x.coinsPerDollar = 1 / e.last
      x.dollarsPerCoin = e.last / 1
    })
  }
}

function bcApi() {
  return resolve('https://blockchain.info', join.apply(null, arguments) + '?format=json')
}

function dgApi() {
  return resolve('https://dogechain.info', join.apply(null, arguments))
}

