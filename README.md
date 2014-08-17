# crypto-fund

This modules will return the total receieved dollar value for an array of bitcoin/dogecoin wallet objects. It also fetches latest conversion values, once upon init, and then every 12 hours. 

Wallet objects must have a value["type"] bitcoin || dogecoin.

See the example below.

```
npm install --save crypto-fund
```


### example

```js
var coins = require('crypto-fund')
var wallets = []

wallets.push({
  address: '1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj',
  type: 'bitcoin'
})

wallets.push({
  address: 'DUFrLfNKgjjKLajbE5DzmJooQXA8xpYHPL',
  type: 'dogecoin'
})

coins.total(wallets, function(err, data){
  console.log(err, data)
})
```
