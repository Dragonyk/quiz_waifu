function getDefin(){
    var defin = [];
    $.ajax({
        url: './_data/choices.json',
        dataType: 'json',
        type: 'GET',
        async : false,
        cache: false,
        success: function (data) {
            $(data).each(function (index, value){
                defin = value.waifu;
            });
        }
    });
    return defin;
}
//1 = questions
//2 = values of questions
function _qsts(choiceIn){
    var defin = getDefin();
    //console.log(defin);
    var qst = [];
    for (var i = 0; i < defin.length; i++){
        var chois = [];
        if(choiceIn===1){
            chois.push(defin[i][0]);
        }
        for (var k = 0; k < defin[i][choiceIn].length; k++){
            chois.push(defin[i][choiceIn][k]);
        }
        qst.push(chois);
        chois = [];
    }
    //console.log(defin.length+", "+defin[0].length+", "+defin[0][1].length);
    return qst;
}

function getQuestions(){
    return _qsts(1);
}
function getValues(){
    return _qsts(2);
}

function getWaifus(){
    var waifus = [];
    $.ajax({
               url: './_data/waifus.json',
               dataType: 'json',
               type: 'GET',
               async : false,
               cache: false,
               success: function (data) {
                   $(data).each(function (index, value){
                       
                       var defin = value.waifu;
                       
                        for (var i = 0; i < defin.length; i++){
                            var chois = [];
                            chois.push(defin[i][0]);
                            chois.push(defin[i][1]);
                            chois.push(defin[i][2]);
                            chois.push(defin[i][3]);
                            
                            waifus.push(chois);
                            chois = [];
                        }
                        //console.log(defin[0][2][1]);
                   });
               }
               
           });
        return waifus;
}

function getYourWaifu(value){
    var waifus = getWaifus();
    var wDefault = ['Sua waifu nao existe','waifu_n_exist.jpg',0,""];
    var waifu = [];
    waifus.sort(sortFunction);
    console.log(genWaifuValue(waifus[0][2]));
    
    for (var i = 0; i < waifus.length; i++) {
        var waifuValCur = genWaifuValue(waifus[i][2]);
        if(value === waifuValCur){
            waifu = waifus[i];
            break;
        }
        else{
            if(waifuValCur > value){
                if(i === 0){
                    waifu = addWaifu(waifus[i], waifuValCur);
                    break;
                }
                var waifuValPrev = genWaifuValue(waifus[i-1][2]);
                if(value < ((waifuValPrev+waifuValCur)/2)){
                    waifu = addWaifu(waifus[i-1], waifuValPrev);
                    break;
                }
                else{
                    waifu = addWaifu(waifus[i], waifuValCur);
                    break;
                }
            }
        }
        if(i===waifus.length-1){
            waifu = addWaifu(waifus[i], waifuValCur);
        }
    }
    
    //console.log(value+"|"+waifu[2]);
    
    
    var mediaWaifu = ((value + waifu[2]) /2);
    
    
    var factor = 5;
    factor = factor/100;
    
    var per_w = [1.0-factor, 1.0+factor];
    //console.log("TEST"+mediaWaifu);
    
    if(mediaWaifu <= (waifu[2]*per_w[0]) || mediaWaifu > (waifu[2]*per_w[1])){
        waifu = wDefault;
    }
    
    return waifu;
}

function addWaifu(waifu, waifuValCur){
    var wai = [];
    wai.push(waifu[0]);
    wai.push(waifu[1]);
    wai.push(waifuValCur);
    wai.push(waifu[3]);
    
    return wai;
}

function genWaifuValue(sel){
    var qst = getValues();
    var val = 0;
    for(var i=0; i<qst.length; i++){
        val+=qst[i][sel[i]];
    }
    return val;
}


function sortFunction(a, b) {
    var at = genWaifuValue(a[2]);
    var bt = genWaifuValue(b[2]);
    
    if (at === bt) { return 0; }
    else { return (at < bt) ? -1 : 1; }
}