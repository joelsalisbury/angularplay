var scansionApp = angular.module('scansionApp', []);
 
scansionApp.controller('bookCntrl', function ($scope) {
  $scope.currentLine = 0;
  $scope.currentLineSyls = new Array();
  $scope.renderedSyllables = new Array();
  $scope.book = {
                "title" : "The Aneid",
                "lines":[{"id":1,"string":"arma virum que cano, Troiae qui primus ab oris","syllables":[{"id":1,"text":"ar","quantity":"-","start":0,"charCnt":2},{"id":2,"text":"ma","quantity":"u","start":2,"charCnt":2},{"id":3,"text":"vi","quantity":"u","start":5,"charCnt":2},{"id":4,"text":"rum","quantity":"-","start":7,"charCnt":3},{"id":5,"text":"que","quantity":"u","start":11,"charCnt":3},{"id":6,"text":"ca","quantity":"u","start":15,"charCnt":2},{"id":7,"text":"no","quantity":"-","start":17,"charCnt":2},{"id":8,"text":"Tro","quantity":"-","start":21,"charCnt":3},{"id":9,"text":"iae","quantity":"-","start":24,"charCnt":3},{"id":10,"text":"qui","quantity":"-","start":28,"charCnt":3},{"id":11,"text":"pri","quantity":"-","start":32,"charCnt":3},{"id":12,"text":"mus","quantity":"u","start":35,"charCnt":3},{"id":13,"text":"ab","quantity":"u","start":39,"charCnt":2},{"id":14,"text":"o","quantity":"-","start":42,"charCnt":1},{"id":15,"text":"ris","quantity":"x","start":43,"charCnt":3}]}]
            };

    $scope.init = function(){
        $scope.currentLineText = $scope.book.lines[$scope.currentLine].string;
        //$scope.getSyllable($scope.currentSyllableNum);
        $scope.currentLineSyls = $scope.book.lines[$scope.currentLine].syllables;
        $scope.doRenderedSyllables();
    }

    $scope.doRenderedSyllables = function(){
        var rendsyls = []
        var fullLine = $scope.book.lines[$scope.currentLine].string;

        //for every syllable in currentLineSyls,
            // grab the characters from currentLineSyl.start + currentLineSyl.charCnt in fullLine
                // stick those characters in renderedSyl[]

        for (var i=0; i<$scope.currentLineSyls.length; i++){
            try{
                var sylNow = $scope.currentLineSyls[i];



                if(i < $scope.currentLineSyls.length-1){
                    var sylNext = $scope.currentLineSyls[i+1];


                    var thechars = fullLine.substring(sylNow.start, sylNext.start);
                
                } else thechars = fullLine.substring(sylNow.start);



                $scope.renderedSyllables[i] = {
                    'id' : sylNow.id,
                    'text' : thechars,
                }
            } catch(doh){console.log(doh)}
        }


    }


});
