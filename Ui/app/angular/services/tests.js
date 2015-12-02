tok.service('$tests',[function(){

  var tests;

  this.gsTests = function(v){
    if(v){
      v.sort(function(l,r){
        return new Date(l.date) < new Date(r.date);
      })
      for(var a = 0; a < v.length; a++){
        v[a].glyphArray = getResults(v[a].results);
      }
      tests = v;
    }
    else return tests;
  }

  var keys = [];

  function findKeys(){
    keys = [];
    for(var a = 0; a < tests.length; a++){
      var t = tests[a];
      var k = t.prefs.env;

      if(keys.indexOf(k) == -1) keys.push(k);
    }
  }




  this.getTests = function(){
    if(!tests) return [];


    return tests;
  }



  var pBook = {glyph: 'book', passed:true};
  var fBook = {glyph: 'book', passed:false};


  var pTest = {glyph: 'list-alt', passed:true};
  var fTest = {glyph: 'list-alt', ran:true,passed:false};
  var seperator = {glyph:'none'};


  function getResults(test){

    var ret = [];

    var r = test;
    for(var a = 0 ; a < r.stories.length; a++){
      var s = r.stories[a];
      var failed = [];
      for(var b = 0; b < s.tests.length; b++){
        if(!s.tests[b].passed) failed.push(b);
      }


      if(failed.length == 0){
        ret.push({obj:pBook,story:a});
      }

      else if(failed.length == s.tests.length){
        ret.push({obj:fBook,story:a});
      }

      else{
        for(var b = 0; b < s.tests.length; b++){
          if(failed.indexOf(b) == -1){
            ret.push({obj:pTest,story:a,test:b});
          }
          else{
            ret.push({obj:fTest,story:a,test:b});
          }
        }
      }


      if(a != r.stories.length - 1) ret.push({obj:seperator});
    }


    return ret;
  }



  var tIndex = -1;
  var curStory = -1;
  var curTest = -1;
  var curLine = -1;

  this.setModal = function(i,s,t,l){

     tIndex = -1;
     curStory = -1;
     curTest = -1;
     curLine = -1;

    if(angular.isDefined(i)) tIndex = i;
    if(angular.isDefined(s)) curStory = s;
    if(angular.isDefined(t)) curTest = t;
    if(angular.isDefined(l)) curLine = l;
  };

  this.getModal = function(){
    return [tIndex,curStory,curTest,curLine];
  }





}]);
