var mode;

var scansionApp = angular.module('scansionApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'timer']).run(function() {
    FastClick.attach(document.body);
});

scansionApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'templates/home.html',
        controller: 'homeCntrl'
      }).
      when('/game', {
        templateUrl: 'templates/game.html',
        controller: 'lineCntrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
}]);


scansionApp.controller('homeCntrl', function ($scope, $rootScope) {
    $rootScope.setMode = function(mode){
        $rootScope.mode = mode;
        console.log(mode + " mode set!");
    } 

    $rootScope.setTime = function(time){
        $rootScope.time = time;
        console.log(time + " time set!");
    }

    $rootScope.setBook = function(book){
        $rootScope.source = book;
        console.log(book + " book set!");
    }

    $rootScope.setBook('data/aeneid.json');
});   
 
scansionApp.controller('lineCntrl', function ($scope, $http, $timeout, $rootScope) {
    $scope.currentLine = 0;
    $scope.currentLineSyls = [];
    $scope.multiplier = 1;
    $scope.incrementer = 6;
    $scope.activeStreak = 0;
    $scope.mode = $rootScope.mode;

   

    $scope.currentScore = 0;

    $scope.currentSyl = 0;

    $scope.init = function(){
        $scope.source = $rootScope.source;

 if($scope.mode == "timed"){
        $scope.timer = {};
        $scope.timer.shown = true;
        $scope.timer.time = $rootScope.time;

        $timeout(function(){$scope.$broadcast('timer-add-cd-seconds', $scope.timer.time)}, 5);
    }
        $http.get($scope.source).success(function(data) {
            $scope.book = data;
            $scope.doRenderedSyllables();
            $scope.highlightSyl(0);
        });
    }

    $scope.doRenderedSyllables = function(){
        $scope.currentLineText = $scope.book.lines[$scope.currentLine].string;
        $scope.currentLineSyls = $scope.book.lines[$scope.currentLine].syllables;
        $scope.renderedSyllables = [];
        var rendsyls = []
        var fullLine = $scope.book.lines[$scope.currentLine].string;

        //for every syllable in currentLineSyls,
            // grab the characters from currentLineSyl.start + currentLineSyl.charCnt in fullLine
                // stick those characters in renderedSyl[]

        for (var i=0; i<$scope.currentLineSyls.length; i++){
            try{
                var sylNow = $scope.currentLineSyls[i];
                var sylNext;
                if(i < $scope.currentLineSyls.length-1){
                    sylNext = $scope.currentLineSyls[i+1];

                    var thechars = fullLine.substr(sylNow.start, sylNow.charCnt);
                
                } else thechars = fullLine.substring(sylNow.start);

                $scope.renderedSyllables.push({
                    'id' : sylNow.id,
                    'text' : thechars,
                    highlightable : true,
                    quantity : sylNow.quantity
                });

                var remainder = sylNext.start - (sylNow.start+sylNow.charCnt);
                var remainderText;
               if(remainder){
                    remainderText = fullLine.substr(sylNext.start-remainder, remainder);
                    $scope.renderedSyllables.push({
                        text : remainderText
                    })
                }

            } catch(doh){console.log(doh)}
        }
    }

    $scope.highlightSyl = function(i){
        //$scope.currentCorrect = $scope.renderedSyllables[$scope.currentSyl].quantity;

        if(i == $scope.renderedSyllables.length-2){
            $scope.hideControls = "hideControls";
        } else{
            $scope.hideControls = "";
        }

        // reset for new line
        if (i >= $scope.renderedSyllables.length-1){
            ++$scope.currentLine;
            console.log($scope.currentLine);
            $scope.doRenderedSyllables();
            i = 0;
            $scope.currentSyl = 0;
        }

        //but always
        if($scope.renderedSyllables[i].highlightable)
            $scope.renderedSyllables[i].highlight = "highlight-current";
        else{
            $scope.highlightNextSyl();
        }
    }

    $scope.highlightNextSyl = function(){
        $scope.highlightSyl(++$scope.currentSyl);
    }

    $scope.evaluateResponse = function(response){
        var correctResponse = $scope.renderedSyllables[$scope.currentSyl].quantity;
        var currentSylObj = $scope.renderedSyllables[$scope.currentSyl];
        if (correctResponse == response){
            isCorrect = true;
            currentSylObj.highlight = "highlight-right";
            $scope.activeStreak++;
            $scope.currentScore += $scope.multiplier * $scope.incrementer;
       }
        else{
            currentSylObj.highlight = "highlight-wrong";
            $scope.activeStreak = 0;
        }
        
        $scope.evaluateStreak();

        $scope.highlightNextSyl();
    }

    $scope.evaluateStreak = function(){
        console.log("activeStreak:"+ $scope.activeStreak);

        //1-9: 6pts each (multiplier is 1)
        if(($scope.activeStreak >= 0) && ($scope.activeStreak < 10)){
            console.log('multiplier is 1!');
            $scope.multiplier = 1;
        }

        //10-19: 12pts each (multiplier is 2)
        if($scope.activeStreak > 9 && $scope.activeStreak < 20){
            console.log('multiplier increased to 3!');
            $scope.multiplier = 2;
        }

        //20-29: 18pts each (multiplier is 3)
        if($scope.activeStreak > 19 && $scope.activeStreak < 20){
            $scope.multiplier = 3;
        }  
        
        //30-39: 24pts each (multiplier is 4)
        if($scope.activeStreak > 29 && $scope.activeStreak < 40){
            $scope.multiplier = 4;
        }         
    }
});



// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

scansionApp.controller('ModalInstanceCtrl',function ($scope, $modalInstance, $rootScope) {


  $scope.setMode = function(mode){
    $rootScope.setMode(mode);
  }

  $scope.setTime = function(time){
    $rootScope.setTime(time);
  }

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

scansionApp.controller('NewGameSetupCtrl', function ($scope, $modal, $log, $rootScope) {

  $scope.open = function (templateurl) {

    var modalInstance = $modal.open({
      templateUrl: templateurl,
      controller: 'ModalInstanceCtrl'
    });
  };
});
