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
      when('/about', {
        templateUrl: 'templates/about.html',
        controller: 'lineCntrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
}]);


scansionApp.controller('homeCntrl', function ($scope, $rootScope, $http) {
    //2 minutes by default
    $rootScope.time = 120;
    $rootScope.globalInfo = $rootScope.globalInfo || {};
    $rootScope.globalInfo.achievements = $rootScope.globalInfo || [];
    $rootScope.bookTitle = "Aeneid";



    $rootScope.setMode = function(mode){
        $rootScope.mode = mode;
        console.log(mode + " mode set!");
    } 

    $rootScope.setTime = function(time){
        $rootScope.time = time;
        console.log(time + " time set!");
    }

    $rootScope.setAllData = function(book){
        $rootScope.source = book;


        $http.get($rootScope.source).success(function(data) {
            $rootScope.allData = data;
        });

        console.log(book + " book set!");
    }

    $rootScope.submitScore = function(score) {
        localStorage.setItem("userHighScore", score);
        $rootScope.globalInfo.userHighScore = score;

        /**var data = {
            score: score,
            leaderboardId: "board1"
        };
        gamecenter.submitScore(successCallback, failureCallback, data);  **/
    }

    $rootScope.reportAchievement = function(achName, fancyName) {

        var data = {
            achievementId: achName,
            percent: "100",
            name: fancyName
        };
        $rootScope.globalInfo.achievements = $rootScope.globalInfo.achievements || [];
        $rootScope.globalInfo.achievements.push(data);
        console.log($rootScope.globalInfo.achievements);
        localStorage.setItem('userAchievements',JSON.stringify($rootScope.globalInfo.achievements));

        //gamecenter.reportAchievement(successCallback, failureCallback, data);    
    }

    var storedHighScore = localStorage.getItem("userHighScore");
    if(!storedHighScore){storedHighScore = 0;}

    var storedAchievements = localStorage.getItem("userAchievements") || null;
    if(storedAchievements)
        storedAchievements = JSON.parse(storedAchievements);

    $rootScope.globalInfo.achievements = storedAchievements;

    $rootScope.globalInfo.userHighScore = storedHighScore;

    $rootScope.setAllData('data/data.json');
});   
 
scansionApp.controller('lineCntrl', function ($scope, $http, $modal, $timeout, $rootScope) {

    
    $scope.currentLineSyls = [];
    $scope.multiplier = 1;
    $scope.incrementer = 6;
    $scope.activeStreak = 0;
    $scope.mode = $rootScope.mode;
    $scope.currentScore = 0;
    $scope.currentSyl = 0;

    $scope.correctAnswers = 0;
    $scope.linesComplete = 0;

    $scope.totalAnswers = 0;
    $scope.bookTitle = $rootScope.bookTitle;

    $scope.init = function(){
        $scope.source = $rootScope.source;

        if($scope.mode == "timed"){
                $scope.gametimer = {};
                $scope.gametimer.shown = true;
                $scope.gametimer.time = $rootScope.time;

                $scope.timerRunning = true;
         
                $scope.startTimer = function (){
                    $scope.$broadcast('timer-start');
                    $scope.timerRunning = true;
                };

                $scope.stopTimer = function (){
                    $scope.$broadcast('timer-stop');
                    $scope.timerRunning = false;
                };

                $scope.$on('timer-stopped', function (event, data){
                   console.log($scope);
                   $scope.disableGame();
                   $scope.$apply();
                });
                
            $scope.countdown = $scope.gametimer.time;
            $scope.interval = 1000;
        }
        


        
            $scope.book = $rootScope.allData.lines[$rootScope.b];
            //console.log(data);
            //console.log($rootScope.b);
   

            $scope.currentLineIndex = $scope.getIndexByLineNum($rootScope.startingLine);
            $scope.doRenderedSyllables();
            $scope.highlightSyl(0);
       
    }

    $scope.getIndexByLineNum = function (lineNumber){
        for (var i=0; i<$scope.book.lines.length; i++){
            if($scope.book.lines[i].id == lineNumber){
                return i;
            }
        }
    }

    $scope.disableGame = function(){
        $scope.gamehappen="gameDisabled";
    }

    $scope.doRenderedSyllables = function(){
        console.log("current line index: " + $scope.currentLineIndex);

        $scope.currentLine = $scope.book.lines[$scope.currentLineIndex];
        //console.log("book: " + $scope.book);

        console.log("line obj: " + $scope.currentLine);
        $scope.currentLineText = $scope.currentLine.string;
        $scope.currentLineSyls = $scope.currentLine.syllables;

        $scope.renderedSyllables = [];
        var rendsyls = []
        var fullLine = $scope.currentLine.string;

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

        console.log($scope.currentLine);


        if(i == $scope.renderedSyllables.length-2){
            $scope.linesComplete += 1;
            $scope.hideControls = "hideControls";
        } else{
            $scope.hideControls = "";
        }

        // reset for new line
        if (i >= $scope.renderedSyllables.length-1){
            ++$scope.currentLineIndex;

            var maxIndex = $scope.book.lines.length;

            if($scope.currentLineIndex >= maxIndex)
                $scope.disableGame();

            $scope.doRenderedSyllables();
            i = 0;
            $scope.currentSyl = 0;
        }

        //but always
        if($scope.renderedSyllables[i].highlightable){
            $scope.renderedSyllables[i].highlight = "highlight-current";
        }
        else{
            $scope.highlightNextSyl();
        }
    }

    $scope.highlightNextSyl = function(){
        $scope.currentSyl++;
        $scope.highlightSyl($scope.currentSyl);
    }

    $scope.evaluateResponse = function(response){
        var correctResponse = $scope.renderedSyllables[$scope.currentSyl].quantity;
        var currentSylObj = $scope.renderedSyllables[$scope.currentSyl];
        $scope.totalAnswers += 1;

        if (correctResponse == response){

            if($scope.activeStreak <= 0)
                $scope.activeStreak = 0;

            isCorrect = true;
            $scope.correctAnswers += 1;

            currentSylObj.highlight = "highlight-right";
            $scope.activeStreak++;
            $scope.currentScore += $scope.multiplier * $scope.incrementer;
       }
        else{
            currentSylObj.highlight = "highlight-wrong";

            if($scope.activeStreak  < 0)
                $sscope.activeStreak--;
            else
                $scope.activeStreak = 0;
        }
        
        $scope.evaluateStreak();

        $scope.highlightNextSyl();
    }

    $scope.evaluateStreak = function(){

            console.log("activeStreak:"+ $scope.activeStreak);

            scoreToBeat = $rootScope.globalInfo.userHighScore;

            if($scope.currentScore>scoreToBeat){
                $rootScope.submitScore($scope.currentScore);
            }

            //1-9: 6pts each (multiplier is 1)
            if(($scope.activeStreak >= 0) && ($scope.activeStreak < 10)){
                console.log('multiplier is 1!');
                $scope.multiplier = 1;
            }

            //10-19: 12pts each (multiplier is 2)
            if($scope.activeStreak > 9 && $scope.activeStreak < 20){
                console.log('multiplier increased to 2!');
                $scope.multiplier = 2;
            }

            //20-29: 18pts each (multiplier is 3)
            if($scope.activeStreak > 19 && $scope.activeStreak < 30){
                console.log('multiplier increased to 3!');
                $scope.multiplier = 3;
            }  
            
            //30-39: 24pts each (multiplier is 4)
            if($scope.activeStreak > 29){
                console.log('multiplier increased to 4!');
                $scope.multiplier = 4;
            }        
            /*
            *   STREAKS START AT 50!
            *   First, check to see if the user already has a streak stored.
            *       If not, store the streak!
            *       If yes, NOTHING! Not twice! Not three times! Just CHILL!
            */
            if($scope.activeStreak == 50){
                console.log('OMG50!');
                $rootScope.reportAchievement('50Straight',"Streak: 50 Straight");
            }

            if($scope.activeStreak == 100){
                console.log('OMG100!');
                $rootScope.reportAchievement('100Straight',"Streak: 100 Straight");
            }     

            if($scope.activeStreak == 250){
                console.log('OMG250!');
                $rootScope.reportAchievement('250Straight',"Streak: 250 Straight");
            }   

            if($scope.activeStreak == 500){
                console.log('OMG500!');
                $rootScope.reportAchievement('500Straight',"Streak: 500 Straight");
            } 

            if($scope.activeStreak == 1000){
                console.log('OMG1000!');
                $rootScope.reportAchievement('1000Straight',"Streak: 1000 Straight");
            }                                          

        }
});


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
scansionApp.controller('ModalInstanceCtrl',function ($scope, $modalInstance, $rootScope) {
$scope.b = "Book 1";

 $scope.yesnocango = false;
 $scope.getIndexByLineNum = function (bnum,lineNumber){
        var buk = $rootScope.allData.lines[bnum];

        var ret = -1;
        for (var i=0; i < buk.lines.length; i++){
            if(buk.lines[i].id == lineNumber){
                ret = i;
            }
        }
        //console.log(ret);
        return ret;
  }


  $scope.v = 1;
  $scope.startingLineChanged = function(v){
    //console.log('you changed the line brah');
    //console.log(v);
    $scope.v = v;
    if($scope.getIndexByLineNum($scope.b, v) != -1){
        $scope.yesnocango = true;
    } else {$scope.yesnocango = false;}

  }  

  $scope.startingBookChanged = function(b){
    //console.log('you changed the book brah');
    //console.log(b);

    var buk = $rootScope.allData.lines[b];
    $scope.availableLines = buk.rangeDisplay;
    $scope.b = b;
    $scope.startingLineChanged(buk.firstLine);

  }

  $scope.startingBookChanged($scope.b);

  $scope.setMode = function(mode){
    $rootScope.setMode(mode);
    $rootScope.startingLine = $scope.v;
    $rootScope.b = $scope.b;
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


scansionApp.controller('AchievementsCtrl', function ($scope, $modal, $log, $rootScope) {

  $scope.achievements = $rootScope.globalInfo.achievements;

  $scope.open = function (templateurl) {

    var modalInstance = $modal.open({
      templateUrl: templateurl,
      controller: 'ModalInstanceCtrl'
    });
  };

  $scope.fetchAchievements = function() {
    var data = { };

    gamecenter.reportAchievement(successCallback, failureCallback, data);

    var successCallback = function(result) {
        if (results) {
            for (var i=0;i<results.length;i++) {
                
            }
        }
    }
  }

 $scope.submitScore = function(score) {
    localStorage.setItem("userHighScore", score);
    $rootScope.globalInfo.userHighScore = score;


    var data = {
        score: score,
        leaderboardId: "board1"
    };
    //gamecenter.submitScore(successCallback, failureCallback, data);  
  }

 $scope.reportAchievement = function(achName, fancyName) {

    $rootScope.globalInfo.achievements[achName] = 100;
    localStorage.setItem('userAchievements',JSON.stringify($rootScope.globalInfo.achievements));

    var data = {
        achievementId: achName,
        percent: "100",
        name:fancyName
    };

    //gamecenter.reportAchievement(successCallback, failureCallback, data);    
 }
 
 $scope.showLeaderboard = function(timeperiod) {

  //The period options are "today", "week" or "all".

    var data = {
        period: timeperiod,
        leaderboardId: "board1"
    };
    //gamecenter.showLeaderboard(successCallback, failureCallback, data);
 }

 $scope.reportAchievement = function(achName) {

    $rootScope.globalInfo.achievements[achName] = 100;
    localStorage.setItem('userAchievements',JSON.stringify($rootScope.globalInfo.achievements));

    var data = {
        achievementId: achName,
        percent: "100"
    };
    gamecenter.reportAchievement(successCallback, failureCallback, data);
 }
});