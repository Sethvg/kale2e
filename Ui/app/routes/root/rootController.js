tok.controller('rootCtrl',function($scope, $root,$modal,$tests){


  $scope.root = $root;


  $scope.parseDate = function(da){
    d = new Date(da);
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ", " + d.getFullYear();
  }



  $scope.getPassed = function(test){

    var c = 0;
    for(b in test.stories){
      st = test.stories[b];
      for(var a = 0; a<st.tests.length; a++){
        if(st.tests[a].passed) c++;
      }
    }

    return c;

  }







  $scope.getSkipped = function(test){

    var ret = 0;

    var r = test;
    for(var a = 0 ; a < r.stories.length; a++){
      var s = r.stories[a];
      for(var b = 0; b < s.tests.length; b++){
        var t = s.tests[b];

        var f = false;

        for(var c= 0; c < t.lines.length;c++){
          var l = t.lines[c];

          if(f)ret++;
          else if(!l.passed){
            f=true;
          }
        }
      }


    }


    return ret;
  }



  $scope.clickResult = function(i,s,t){

    console.log(i);
    console.log(s);
    console.log(t);


    $tests.setModal(i,s,t);
    curModal = $modal.open({
      animation:true,
      templateUrl:'modals/result.html',
      controller:'resultModalCtrl',
      size:'lg'
    });
  }

  $scope.test = 'test';






});
