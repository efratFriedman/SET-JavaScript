"use strict"
//popup window that the player insert his name and choose the level we want to player
function popLevels() {
   let levelPup = document.getElementById('level');
   levelPup.style.visibility = "visible";
   level.classList.add("open");
   level.classList.remove("close");
}
function closePopUP() {
   let levelPup = document.getElementById("level")
   levelPup.style.visibility = "hidden";
   level.classList.remove("open");
   level.classList.add("close");
}
function saveUser(event) {
   var Saveuser
   if(event.target.value==="null"){
      Saveuser="anonymous"
   }
   else{
    Saveuser = event.target.value;}
   localStorage.setItem("user", Saveuser)
}