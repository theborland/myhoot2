var continents = ['sm_state_SA', 'sm_state_NA', 'sm_state_EU', 'sm_state_AF', 'sm_state_NS','sm_state_SS','sm_state_ME','sm_state_OC'];
var selected = 8;

//  adds the onClick functions to all the game types
function initChecks(){

    var games = ['gsGeo', 'gsPop', 'gsTemp', 'gsAge', 'gsHist', 'gsRand'];

    for(var i = 0; i < 6; i++) {
        var gs = document.getElementById("gs"+(i+1));
       var c = gs.className;
       gs.onclick = function() {
            var name = games[parseInt(this.id.charAt(this.id.length-1)) - 1];
            var cs = this.children;


            if(this.className.indexOf("gsSel") >= 0){
                this.classList.remove("gsSel");
                document.getElementById(name).value = "false";
            }else{
                this.classList.add("gsSel");
                document.getElementById(name).value = "true";
            }
        }
    }



}


function initRegions(){
        setTimeout(function(){
        for(var i = 0; i < continents.length; i++) {
        var gs = document.getElementsByClassName(continents[i]);
       //var c = gs.className;
       //alert(gs.className);
        gs[0].classList.add("pathSelected");
        gs[0].onclick = function() {
            if(((String)(this.classList)).indexOf("pathSelected") >= 0){
                this.classList.remove("pathSelected");
                document.getElementById(((String)(this.classList)).split(" ")[0]).value = "false";
                selected--;
            }else{
                this.classList.add("pathSelected");
                document.getElementById(((String)(this.classList)).split(" ")[0]).value = "true";
                selected++;
            }
            animateSelectAll();
        }
    }

    }, 300);

}


// animates the plane and the banner, given frame number.
function animatePlane(i){
    document.getElementById('linkPlane').style.top =    ( 20 + Math.sin(i/20)*15 ) + "px";
    document.getElementById('joinHere').style.top =     ( 20 + Math.sin((i-20)/20)*15 ) + "px";
    document.getElementById('bannerLink').style.top =   ( 20 + Math.sin((i-10)/20)*15 ) + "px";
}


function showSetting(){
    document.getElementById("settingBlur").style.display = "block";
    window.setTimeout( function(){
            document.getElementById("settingBlur").style.opacity = "1";
    }, 50);
    document.getElementById("settingWrap").style.opacity = "1";
    document.getElementById("settingWrap").style.top = "0px";
}

function hideSetting(){
    document.getElementById("settingBlur").style.opacity = "0";
    window.setTimeout( function(){
        document.getElementById("settingBlur").style.display = "none";
    }, 700);
    document.getElementById("settingWrap").style.opacity = "0";
    document.getElementById("settingWrap").style.top = '-700px';
}



function selectall(){
    for(var i = 0; i < continents.length; i++) {
        var gs = document.getElementsByClassName(continents[i]);
        if(((String)(gs[0].classList)).indexOf("pathSelected") >= 0 && selected>4){
            gs[0].classList.remove("pathSelected");
            document.getElementById(((String)(gs[0].classList)).split(" ")[0]).value = "false";
        }else if(((String)(gs[0].classList)).indexOf("pathSelected") < 0 && selected <= 4){
            gs[0].classList.add("pathSelected");
            document.getElementById(((String)(gs[0].classList)).split(" ")[0]).value = "true";
        }
    }

    if(selected>4){
        selected = 0;
        document.getElementById('statesCB').checked = false;
    }else{
        selected = 8;
        document.getElementById('statesCB').checked = true;
    }

    animateSelectAll();
}

function animateSelectAll(){
    if(selected>4){
        document.getElementById('selectAll').value = "deselect all";
    }else{
        document.getElementById('selectAll').value = "select all";
    }

}

function removeUser(username){
    //alert("user is..." + username);
    $.ajax({
        url: "rejectUser.php?name="+username
    }).done(function(){

        $('#user_w_name_' + username).animate({
            opacity: 0 ,
            width: "0px"
        }, 500, function() {
            $('#user_w_name_' + username).remove();
        });

    });
}

