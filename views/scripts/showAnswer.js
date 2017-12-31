  function comma(num){
    num = num+"";
    arr = num.split("");
    newS = "";
    for(var i=0; i<arr.length; i++){
      if((arr.length - i)%3 == 0 && i!=0)
        newS = newS + "," + arr[i];
      else
        newS = newS + arr[i];
    }
    return newS;
  }
function animateNum(i, n, fin, finNum, time){
      setTimeout( function(){
        if(fin)
          document.getElementById("answerNum" + n).innerHTML = finNum;
        else
          document.getElementById("answerNum" + n).innerHTML = Math.round(Math.random() * 9);
    }, Math.pow(i, 1.05) * time);

}
