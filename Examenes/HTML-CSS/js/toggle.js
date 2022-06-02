function cambioDiv(){
    if(document.getElementById("begin").style.display == "none"){
        document.getElementById("begin").style.display = "inline";
        document.getElementById("end").style.display = "none";
    }
    else{
        document.getElementById("begin").style.display = "none";
        document.getElementById("end").style.display = "inline";
    }
}
