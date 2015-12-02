tok.service('$root',[function(){

  var SearchItem;

  this.gsSearchItem = function(val)
  {
      if(angular.isDefined(val)) SearchItem = val;
      else return SearchItem;
  }



}]);
