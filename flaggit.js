module.exports = flaggit

function flaggit(flag, cb){
  
  var data = []
  var x = flag

  return function(dat){
    data.push(dat)
    if(--x==0){
      cb(null, data)
    }
  }
}

