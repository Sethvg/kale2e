fs = require('fs');

fs.rename('node_modules/kale2e/Example/steps','./steps',function(err,body){
   if(err)console.log(err);
});

fs.rename('node_modules/kale2e/Example/preferences','./preferences',function(err,body){
   if(err)console.log(err);
});

fs.rename('node_modules/kale2e/Example/stories','./stories',function(err,body){
   if(err)console.log(err);
});
