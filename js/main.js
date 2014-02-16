var scansionApp = angular.module('scansionApp', []);
 
scansionApp.controller('bookCntrl', function ($scope) {
  $scope.currentLine = 0;
  $scope.currentLineSyls = new Array();
  $scope.renderedSyllables = new Array();

  $scope.currentSyl = 0;

  $scope.book = {
                "title" : "The Aneid",
                "lines":[{"id":1,"string":"arma virumque cano, Troiae qui primus ab oris","syllables":[{"id":0,"text":"ar","quantity":"-","start":0,"charCnt":2},{"id":1,"text":"ma","quantity":"u","start":2,"charCnt":2},{"id":2,"text":"vi","quantity":"u","start":5,"charCnt":2},{"id":3,"text":"rum","quantity":"-","start":7,"charCnt":3},{"id":4,"text":"que","quantity":"u","start":10,"charCnt":3},{"id":5,"text":"ca","quantity":"u","start":14,"charCnt":2},{"id":6,"text":"no","quantity":"-","start":16,"charCnt":2},{"id":7,"text":"Tro","quantity":"-","start":20,"charCnt":3},{"id":8,"text":"iae","quantity":"-","start":23,"charCnt":3},{"id":9,"text":"qui","quantity":"-","start":27,"charCnt":3},{"id":10,"text":"pri","quantity":"-","start":31,"charCnt":3},{"id":11,"text":"mus","quantity":"u","start":34,"charCnt":3},{"id":12,"text":"ab","quantity":"u","start":38,"charCnt":2},{"id":13,"text":"o","quantity":"-","start":41,"charCnt":1},{"id":14,"text":"ris","quantity":"x","start":42,"charCnt":3}]},{"id":2,"string":"Italiam, fato profugus, Laviniaque venit","syllables":[{"id":0,"text":"It","quantity":"-","start":0,"charCnt":2},{"id":1,"text":"al","quantity":"u","start":2,"charCnt":2},{"id":2,"text":"i","quantity":"u","start":4,"charCnt":1},{"id":3,"text":"am","quantity":"-","start":5,"charCnt":2},{"id":4,"text":"fa","quantity":"-","start":9,"charCnt":2},{"id":5,"text":"to","quantity":"-","start":11,"charCnt":2},{"id":6,"text":"pro","quantity":"u","start":14,"charCnt":3},{"id":7,"text":"fu","quantity":"u","start":17,"charCnt":2},{"id":8,"text":"gus","quantity":"-","start":19,"charCnt":3},{"id":9,"text":"la","quantity":"-","start":24,"charCnt":2},{"id":10,"text":"vin","quantity":"-","start":26,"charCnt":3},{"id":11,"text":"ia","quantity":"u","start":29,"charCnt":2},{"id":12,"text":"que","quantity":"u","start":31,"charCnt":3},{"id":13,"text":"ven","quantity":"-","start":35,"charCnt":3},{"id":14,"text":"it","quantity":"x","start":38,"charCnt":2}]},{"id":3,"string":"litora, multum ille et terris iactatus et alto","syllables":[{"id":0,"text":"lit","quantity":"-","start":0,"charCnt":3},{"id":1,"text":"o","quantity":"u","start":3,"charCnt":1},{"id":2,"text":"ra","quantity":"u","start":4,"charCnt":2},{"id":3,"text":"mul","quantity":"-","start":8,"charCnt":3},{"id":4,"text":"tum-il","quantity":"-","start":11,"charCnt":6},{"id":5,"text":"le-et","quantity":"-","start":17,"charCnt":5},{"id":6,"text":"ter","quantity":"-","start":23,"charCnt":3},{"id":7,"text":"ris","quantity":"-","start":26,"charCnt":3},{"id":8,"text":"i-ac","quantity":"-","start":30,"charCnt":3},{"id":9,"text":"tat","quantity":"-","start":33,"charCnt":3},{"id":10,"text":"us","quantity":"u","start":36,"charCnt":2},{"id":11,"text":"et","quantity":"u","start":39,"charCnt":2},{"id":12,"text":"al","quantity":"-","start":42,"charCnt":2},{"id":13,"text":"to","quantity":"x","start":44,"charCnt":2}]},{"id":4,"string":"vi superum saevae memorem Iunonis ob iram","syllables":[{"id":0,"text":"vi","quantity":"-","start":0,"charCnt":2},{"id":1,"text":"sup","quantity":"u","start":3,"charCnt":3},{"id":2,"text":"er","quantity":"u","start":6,"charCnt":2},{"id":3,"text":"um","quantity":"-","start":8,"charCnt":2},{"id":4,"text":"sae","quantity":"-","start":11,"charCnt":3},{"id":5,"text":"vae","quantity":"-","start":14,"charCnt":3},{"id":6,"text":"mem","quantity":"u","start":18,"charCnt":3},{"id":7,"text":"or","quantity":"u","start":21,"charCnt":2},{"id":8,"text":"em","quantity":"-","start":23,"charCnt":2},{"id":9,"text":"Iun","quantity":"-","start":26,"charCnt":3},{"id":10,"text":"on","quantity":"-","start":29,"charCnt":2},{"id":11,"text":"is","quantity":"u","start":31,"charCnt":2},{"id":12,"text":"ob","quantity":"u","start":34,"charCnt":2},{"id":13,"text":"ir","quantity":"-","start":37,"charCnt":2},{"id":14,"text":"am","quantity":"x","start":39,"charCnt":2}]},{"id":5,"string":"multa quoque et bello passus, dum conderet urbem","syllables":[{"id":0,"text":"mul","quantity":"-","start":0,"charCnt":3},{"id":1,"text":"ta","quantity":"u","start":3,"charCnt":2},{"id":2,"text":"quo","quantity":"u","start":6,"charCnt":3},{"id":3,"text":"que-et","quantity":"-","start":9,"charCnt":6},{"id":4,"text":"bel","quantity":"-","start":16,"charCnt":3},{"id":5,"text":"lo","quantity":"-","start":19,"charCnt":2},{"id":6,"text":"pass","quantity":"-","start":22,"charCnt":4},{"id":7,"text":"us","quantity":"-","start":26,"charCnt":2},{"id":8,"text":"dum","quantity":"-","start":30,"charCnt":3},{"id":9,"text":"con","quantity":"-","start":34,"charCnt":3},{"id":10,"text":"der","quantity":"u","start":37,"charCnt":3},{"id":11,"text":"et","quantity":"u","start":40,"charCnt":2},{"id":12,"text":"ur","quantity":"-","start":43,"charCnt":2},{"id":13,"text":"bem","quantity":"x","start":45,"charCnt":3}]},{"id":6,"string":"inferretque deos Latio, genus unde Latinum,","syllables":[{"id":0,"text":"in","quantity":"-","start":0,"charCnt":2},{"id":1,"text":"fer","quantity":"-","start":2,"charCnt":3},{"id":2,"text":"ret","quantity":"-","start":5,"charCnt":3},{"id":3,"text":"que","quantity":"u","start":8,"charCnt":3},{"id":4,"text":"de","quantity":"u","start":12,"charCnt":2},{"id":5,"text":"os","quantity":"-","start":14,"charCnt":2},{"id":6,"text":"La","quantity":"u","start":17,"charCnt":2},{"id":7,"text":"ti","quantity":"u","start":19,"charCnt":2},{"id":8,"text":"o","quantity":"-","start":21,"charCnt":1},{"id":9,"text":"gen","quantity":"u","start":24,"charCnt":3},{"id":10,"text":"us","quantity":"u","start":27,"charCnt":2},{"id":11,"text":"un","quantity":"-","start":30,"charCnt":2},{"id":12,"text":"de","quantity":"u","start":32,"charCnt":2},{"id":13,"text":"la","quantity":"u","start":35,"charCnt":2},{"id":14,"text":"tin","quantity":"-","start":37,"charCnt":3},{"id":15,"text":"um","quantity":"x","start":40,"charCnt":2}]},{"id":7,"string":"Albanique patres, atque altae moenia Romae.","syllables":[{"id":0,"text":"Al","quantity":"-","start":0,"charCnt":2},{"id":1,"text":"ban","quantity":"-","start":2,"charCnt":3},{"id":2,"text":"i","quantity":"-","start":5,"charCnt":1},{"id":3,"text":"que","quantity":"u","start":6,"charCnt":3},{"id":4,"text":"pat","quantity":"u","start":10,"charCnt":3},{"id":5,"text":"res","quantity":"-","start":13,"charCnt":3},{"id":6,"text":"at","quantity":"-","start":18,"charCnt":2},{"id":7,"text":"que-al","quantity":"-","start":20,"charCnt":6},{"id":8,"text":"tae","quantity":"-","start":26,"charCnt":3},{"id":9,"text":"moe","quantity":"-","start":30,"charCnt":3},{"id":10,"text":"ni","quantity":"u","start":33,"charCnt":2},{"id":11,"text":"a","quantity":"u","start":35,"charCnt":1},{"id":12,"text":"Rom","quantity":"-","start":37,"charCnt":3},{"id":13,"text":"ae","quantity":"x","start":40,"charCnt":2}]},{"id":8,"string":"Musa, mihi causas memora, quo numine laeso,","syllables":[{"id":0,"text":"Mu","quantity":"-","start":0,"charCnt":2},{"id":1,"text":"sa","quantity":"u","start":2,"charCnt":2},{"id":2,"text":"mi","quantity":"u","start":6,"charCnt":2},{"id":3,"text":"hi","quantity":"-","start":8,"charCnt":2},{"id":4,"text":"cau","quantity":"-","start":11,"charCnt":3},{"id":5,"text":"sas","quantity":"-","start":14,"charCnt":3},{"id":6,"text":"mem","quantity":"u","start":18,"charCnt":3},{"id":7,"text":"o","quantity":"u","start":21,"charCnt":1},{"id":8,"text":"ra","quantity":"-","start":22,"charCnt":2},{"id":9,"text":"quo","quantity":"-","start":26,"charCnt":3},{"id":10,"text":"num","quantity":"-","start":30,"charCnt":3},{"id":11,"text":"in","quantity":"u","start":33,"charCnt":2},{"id":12,"text":"e","quantity":"u","start":35,"charCnt":1},{"id":13,"text":"lae","quantity":"-","start":37,"charCnt":3},{"id":14,"text":"so","quantity":"x","start":40,"charCnt":2}]},{"id":9,"string":"quidve dolens, regina deum tot volvere casus","syllables":[{"id":0,"text":"quid","quantity":"-","start":0,"charCnt":4},{"id":1,"text":"ve","quantity":"u","start":4,"charCnt":2},{"id":2,"text":"do","quantity":"u","start":7,"charCnt":2},{"id":3,"text":"lens","quantity":"-","start":9,"charCnt":4},{"id":4,"text":"reg","quantity":"-","start":15,"charCnt":3},{"id":5,"text":"in","quantity":"-","start":18,"charCnt":2},{"id":6,"text":"a","quantity":"u","start":20,"charCnt":1},{"id":7,"text":"de","quantity":"u","start":22,"charCnt":2},{"id":8,"text":"um","quantity":"-","start":24,"charCnt":2},{"id":9,"text":"tot","quantity":"-","start":27,"charCnt":3},{"id":10,"text":"vol","quantity":"-","start":31,"charCnt":3},{"id":11,"text":"ver","quantity":"u","start":34,"charCnt":3},{"id":12,"text":"e","quantity":"u","start":37,"charCnt":1},{"id":13,"text":"cas","quantity":"-","start":39,"charCnt":3},{"id":14,"text":"us","quantity":"x","start":42,"charCnt":2}]},{"id":10,"string":"insignem pietate virum, tot adire labores","syllables":[{"id":0,"text":"in","quantity":"-","start":0,"charCnt":2},{"id":1,"text":"sig","quantity":"-","start":2,"charCnt":3},{"id":2,"text":"nem","quantity":"-","start":5,"charCnt":3},{"id":3,"text":"pi","quantity":"u","start":9,"charCnt":2},{"id":4,"text":"e","quantity":"u","start":11,"charCnt":1},{"id":5,"text":"tat","quantity":"-","start":12,"charCnt":3},{"id":6,"text":"e","quantity":"u","start":15,"charCnt":1},{"id":7,"text":"vir","quantity":"u","start":17,"charCnt":3},{"id":8,"text":"um","quantity":"-","start":20,"charCnt":2},{"id":9,"text":"tot","quantity":"u","start":24,"charCnt":3},{"id":10,"text":"ad","quantity":"u","start":28,"charCnt":2},{"id":11,"text":"ir","quantity":"-","start":30,"charCnt":2},{"id":12,"text":"e","quantity":"u","start":32,"charCnt":1},{"id":13,"text":"lab","quantity":"u","start":34,"charCnt":3},{"id":14,"text":"or","quantity":"-","start":37,"charCnt":2},{"id":15,"text":"es","quantity":"x","start":39,"charCnt":2}]}]
            };

    $scope.init = function(){
        $scope.doRenderedSyllables();
        $scope.highlightSyl(0);
    }

    $scope.doRenderedSyllables = function(){
        $scope.currentLineText = $scope.book.lines[$scope.currentLine].string;
        $scope.currentLineSyls = $scope.book.lines[$scope.currentLine].syllables;

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
                    'text' : thechars
                }
            } catch(doh){console.log(doh)}
        }
    }

    $scope.highlightSyl = function(i){

        if (i >= $scope.renderedSyllables.length){
            ++$scope.currentLine;
            $scope.doRenderedSyllables();
            i = 0;
            $scope.currentSyl = 0;
        }

        //but always
        $scope.renderedSyllables[i].highlight = "highlight-blue";
    }

    $scope.highlightNextSyl = function(){
        $scope.highlightSyl(++$scope.currentSyl);
    }

    $scope.evaluateResponse = function(response){
        var correctResponse = $scope.currentLineSyls[$scope.currentSyl].quantity;
        var currentSylObj = $scope.renderedSyllables[$scope.currentSyl];
        if (correctResponse == response){
            currentSylObj.highlight = "highlight-green";
        }
        else
            currentSylObj.highlight = "highlight-red";

        $scope.highlightNextSyl();
    }
});
