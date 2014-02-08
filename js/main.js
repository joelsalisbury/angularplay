var scansionApp = angular.module('scansionApp', []);
 
scansionApp.controller('bookCntrl', function ($scope) {
  $scope.currentLine = 0;
  $scope.currentSyllableNum = 0;
  $scope.currentLineText = "";
  $scope.currentSyllable = "";
  $scope.book = {
                "title" : "The Aneid",
                "lines" : [
                    {
                        "id" : 1,
                        "string": "arma virumque cano, Troiae qui primus ab oris",
                        "syllables": [
                            {"id": 0, "text": "ar", "quantity" : "-"},
                            {"id": 1, "text":"ma", "quantity" : "u"},
                            {"id": 2, "text":"vi", "quantity" : "u"},
                            {"id": 3, "text":"rum", "quantity" : "-"},
                            {"id": 4, "text":"que ", "quantity" : "u"},
                            {"id": 5, "text":"ca", "quantity" : "u"},
                            {"id": 6, "text":"no", "quantity" : "-"},
                            {"id": 7, "text":"Tro", "quantity" : "-"},
                            {"id": 8, "text":"iae", "quantity" : "-"},
                            {"id": 9, "text":"qui", "quantity" : "-"},
                            {"id": 10, "text":"pri", "quantity" : "-"},
                            {"id": 11, "text":"mus", "quantity" : "u"},
                            {"id": 12, "text":"ab", "quantity"  : "u"},
                            {"id": 13, "text":"o", "quantity"   : "-"},
                            {"id": 14, "text":"ris", "quantity" : "x"}
                        ]
                    },

                    {
                        "id" : 2,
                        "string": "Italiam, fato profugus, Laviniaque venit",
                        "syllables" : [
                            {"id": 0, "text": "It", "quantity" : "-"},
                            {"id": 1, "text":"al", "quantity" : "u"},
                            {"id": 2, "text":"i", "quantity" : "u"},
                            {"id": 3, "text":"am", "quantity" : "-"},
                            {"id": 4, "text":"fa", "quantity" : "u"},
                            {"id": 5, "text":"to", "quantity" : "u"},
                            {"id": 6, "text":"pro", "quantity" : "-"},
                            {"id": 7, "text":"fu", "quantity" : "-"},
                            {"id": 8, "text":"gus", "quantity" : "-"},
                            {"id": 9, "text":"la", "quantity" : "-"},
                            {"id": 10, "text":"vin", "quantity" : "-"},
                            {"id": 11, "text":"ia", "quantity" : "u"},
                            {"id": 12, "text":"que", "quantity"  : "u"},
                            {"id": 13, "text":"ven", "quantity"   : "-"},
                            {"id": 14, "text":"it", "quantity" : "x"}
                        ]
                    }
                ]
            }

    $scope.init = function(){
        $scope.currentLineText = $scope.book.lines[$scope.currentLine].string;
        $scope.getSyllableInCurrentLine($scope.currentSyllableNum);
    }

    $scope.getSyllableInCurrentLine = function(syllable){
         $scope.currentSyllable = $scope.book.lines[$scope.currentLine].syllables[syllable];
    }

    $scope.evaluateResponse = function(response){
        var correctResponse = $scope.currentSyllable.quantity;

        $scope.answerIsCorrect = (correctResponse === response);

        $scope.currentSyllableNum++;
        $scope.getSyllableInCurrentLine($scope.currentSyllableNum);
    }
});
