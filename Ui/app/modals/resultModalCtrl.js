tok.controller('resultModalCtrl',['$scope','$tests',function($scope,$tests){
  var ind = $tests.getModal();

  $scope.pPath = '';

  $scope.getTest = function(){
    return $tests.gsTests()[ind[0]].results.stories[ind[1]].tests[ind[2]];
  }

  $scope.getStory = function(){
    return $tests.gsTests()[ind[0]].results.stories[ind[1]];
  }




  $scope.getPassedLines = function(lineArr){
    var ret = [];
    for(var a = 0; a < lineArr.length; a++){
      if(lineArr[a].passed) ret.push(a);
      else{
        break;
      }
    }

    return ret;
  }

  $scope.getFailedLines = function(lineArr){
    var ret = [];
    for(var a = 0; a < lineArr.length; a++){
      if(!lineArr[a].passed) ret.push(a);
    }

    return ret;
  }

  $scope.getSkippedLines = function(lineArr){
    var ret = [];
    var s = false;
    for(var a = 0; a < lineArr.length; a++){
      if(!lineArr[a].passed) s = true;
      else if(s){
        ret.push(a);
      }
    }

    return ret;
  }

  $scope.getLineStyle = function(index,test){
    var s = {};
    s.color = 'green';


    if(!test) test = $scope.getTest();


    if(test.passed) s.color = 'green';
    else {
      var f = -1;
      for (var a = 0; a < test.lines.length; a++) {
        if(test.lines[a].passed == false) f = a;
      }
    }

    if(index == f){
      s.color='red';
    }if(index > f){
      s.color ='black';
    }

    return s;
  }

  $scope.getFile = function(){
    return $tests.gsTests()[ind[0]].results.stories[ind[1]].file;
  }


  $scope.getNumberOfPassedTests = function(story){
    var ret = 0;

    for(var a = 0; a < story.tests.length; a++)
    {
      if(story.tests[a].passed) ret++;
    }

    return ret;
  }

  $scope.getNumberOfFailedTests = function(story){
    var ret = 0;

    for(var a = 0; a < story.tests.length; a++)
    {
      if(!story.tests[a].passed) ret++;
    }

    return ret;
  };

  $scope.getNumberOfLines = function(story){
    var ret = 0;

    for(var a = 0; a < story.tests.length; a++)
    {
      ret+=story.tests[a].lines.length;
    }

    return ret;
  };



  function calcPath() {
    if (ind[1] == -1) {
      $scope.pPath = 'full';
    } else if (ind[2] == -1) {
      $scope.pPath = 'story';
      $scope.title = "Story - " + $scope.getFile();
    } else if (ind[3] == -1) {
      $scope.pPath = 'test';
      $scope.title = "Test - " + $scope.getTest().title;
    } else {
      $scope.pPath = 'line';
    }
  }
  calcPath();



  $scope.goToTest = function(i){
    ind[2]=i;
    calcPath();
  }


  $scope.upLevel = function(){
     if (ind[2] == -1) {
      ind[1] = -1;
    } else if (ind[3] == -1) {
       ind[2] = -1;
    } else {
       ind[3] = -1;
    }

    calcPath();
  }


}]);
