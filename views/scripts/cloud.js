class Cloud{

    constructor(id, docHeight, docWidthT){
        this.id=id;
        this.numBoxes =     Math.floor( Math.random() * 5 ) + 8;
        this.overallTop =   Math.floor( Math.random() * docHeight * 0.4);
        this.docWidth = docWidthT;
        this.overallLeft = -400;
        this.speed = Math.floor( Math.random() * 1 ) + 2;
        document.getElementById("clouds").innerHTML = document.getElementById("clouds").innerHTML + "<div class='cloudWrap' id='cloudWrap_" + this.id + "'></div>";
        for(var i=0; i<this.numBoxes; i++){
            document.getElementById("cloudWrap_" + this.id).innerHTML = document.getElementById("cloudWrap_" + this.id).innerHTML + "<div class='cloud' id='cloud_" + this.id + "_" + i + "''><div class='cloudShadow'></div></div>";
            document.getElementById("cloud_" + this.id + "_" + i ).style.top    = Math.floor( Math.random() * 30 + this.overallTop )         + "px";
            document.getElementById("cloud_" + this.id + "_" + i ).style.left   = Math.floor( Math.random() * -100 + i*20 + this.overallLeft)       + "px";
            document.getElementById("cloud_" + this.id + "_" + i ).style.width  = Math.floor( Math.random() * 70 + 30)                     + "px";
            document.getElementById("cloud_" + this.id + "_" + i ).style.height  = document.getElementById("cloud_" + this.id + "_" + i ).style.width;
            
            //document.getElementById("cloud_" + this.id + "_" + i ).style.height = Math.floor( Math.random() * 50  + 20)                     + "px";

        }
    }

    animate(x){
        for(var i=0; i<this.numBoxes; i++){
            var left = document.getElementById("cloud_" + this.id + "_" + i ).style.left;
            var leftInt = parseInt(left) + this.speed;
            this.overallLeft = this.overallLeft + this.speed;
            document.getElementById("cloud_" + this.id + "_" + i ).style.left = (leftInt)+"px";
        }
    }
    destroy(width){
        if(width < this.overallLeft){
            alert("im dead" + this.id);
            return 1;
        }
        //alert("" + this.docWidth + "    " + this.overallLeft);
        return 0;
    }
}

