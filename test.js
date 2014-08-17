var coins = require('./')
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
