"use strict"
let arrayCards = localStorage.getItem("card");//bring the object card arr
let boardCard = [];
let checkCard = [];
let Records=[];
let d;
let intervalId;
let set = false;
let points = 0;
let flag = window.location.href.split('=')[1];
arrayCards = JSON.parse(arrayCards);
bar();
Time(1);
function CardLayout() {//laying out the cards using random on the board and deleting them from the array of card objects
  for (d = 0; d < 12; d++) {
    let rand = Math.floor(Math.random() * (arrayCards.length - 1));
    let img = document.createElement("img");
    img.classList.add("img_card");
    img.src = arrayCards[rand].src;
    img.id = d;
    let div = document.getElementById(d.toString());
    div.appendChild(img);
    div.addEventListener("click", selectCards);
    boardCard[d] = arrayCards[rand];
    arrayCards.splice(rand, 1);
  }
}
function selectCards(event) {// a function that insert the selected card into an array of three selected cards
  let sound = new Audio('../audio/choose.mp3');
  sound.play();
  if (!event.target.classList.contains('selected')) {
    if (checkCard.length - 1 < 3) {//
      checkCard.push(boardCard[parseInt(event.target.id)]);
      checkCard[checkCard.length - 1].id = event.target.id
      event.target.classList.add('selected');
    }
    if (checkCard.length == 3) {
      check();
    }
  }
  else {//in case he regret and want to cancel his choice  the card will be deleted from the set of selected cards
    event.target.classList.remove('selected');
    for (let k = 0; k < checkCard.length; k++) {
      if (event.target.id === checkCard[k].id) {
        checkCard[k].id = ""
        checkCard.splice(k, 1);
        break;

      }
    }
  }

}
function check() {//a function that checks the legality of the selected card when the selcted cards arr is full
  let diffrence = 0, same = 0;
  let data = [//a  data matrix that store in each line another attribute of each selected card
    [checkCard[0].color, checkCard[1].color, checkCard[2].color],//color
    [checkCard[0].shape, checkCard[1].shape, checkCard[2].shape],//shape
    [checkCard[0].amount, checkCard[1].amount, checkCard[2].amount],//amount
    [checkCard[0].filling, checkCard[1].filling, checkCard[2].filling]//fill
  ]
  for (let i = 0; i < 4; i++) {
    if (data[i][0] != data[i][1] && data[i][0] != data[i][2] && data[i][1] != data[i][2]) {//count how many attributes are completely different
      diffrence++;
    }
    else if (data[i][0] == data[i][1] && data[i][0] == data[i][2]) {//count how many attributes are the same
      same++;
    }
  }
  //check all four conditions to make a set
  if (diffrence == 4) {
    set = true
  }
  else if (diffrence == 3 && same == 1) {
    set = true
  }
  else if (diffrence == 1 && same == 3) {
    set = true;
  }
  else if (diffrence == 2 && same == 2) {
    set = true;
  }
  checkSet();
}
function checkSet() {//a function that  update the state of the board according to the set or not set
 let selectedCards = document.getElementsByClassName('selected');
  if (!set) {//if the player was wrong
    //one heart will break and all the three cards will paint in red
    removeHeart();
    for (let i = 0; i <= selectedCards.length; i++) {
        if (selectedCards.length > 0) {
        selectedCards[i].classList.add('error');
        selectedCards[i--].classList.remove('selected');
      }
      else {
        break;
      }
    }
    let sound = new Audio('../audio/notset.mp3');
    sound.play();
    checkCard.splice(0, 3);
    setTimeout(deleteErrorBorder, 500);
  }
  else {//if he was right all the cards will paint in green
    addPoints();
    for (let i = 0; i <= selectedCards.length; i++) {
      if (selectedCards.length > 0) {
        selectedCards[i].classList.add('correct');
        selectedCards[i--].classList.remove('selected');
      }
      else {
        break;
      }
    }
    let sound = new Audio('../audio/set.mp3');
    sound.play();
    setTimeout(deleteCorrectCards, 500);//change the correct cards on the board
  }
}
function deleteErrorBorder() {//function that delete only the border if there is no set
  let errors = document.getElementsByClassName('error');
  // convert to array
  let errorsArray = Array.from(errors);
  //delet the class if the set is wrong by foreach loop that running on the cards
  errorsArray.forEach(function (errorCard) {
    errorCard.classList.remove('error');
  });
}
function deleteCorrectCards() {//function that deletes the border of the correct cards after the selection
  for (let z = 0; z < checkCard.length; z++) {
    for (let l = 0; l < boardCard.length; l++) {
      if (checkCard[z].name == boardCard[l].name) {
        if (d <= 12&&arrayCards.length>0) {
          if (arrayCards.length != 0) {
            let rand = Math.floor(Math.random() * (arrayCards.length - 1));
            let div = document.getElementById(l.toString())//calling the div  that contain the image
            let img = div.getElementsByTagName("img")[0];//Getting the image that is inside the div and since there is only one then 
            //is always in the first place in the arr
            img.setAttribute("src", arrayCards[rand].src);//putting a new image insted of the correct card
            boardCard[l] = arrayCards[rand];
            arrayCards.splice(rand, 1);
            break;
          }
        }
        else if(d <= 12&&arrayCards.length==0){
          let corrects = document.getElementsByClassName('correct');
          let correctsArray = Array.from(corrects);
          correctsArray.forEach(function (corrects) {
            corrects.classList.remove('correct');
          });
          popUp();
          return;
        }
        else {
          if (l > 11) {//if the card is selected from the other three cards that was added by the player
            boardCard.splice(l, 1);
          }
          else {
            let change_div = document.getElementById(l.toString());//the div we will want to change
            let change_img = change_div.getElementsByTagName("img")[0];
            let last_img = boardCard[boardCard.length - 1].src;
            change_img.setAttribute("src", last_img);
            boardCard[l] = boardCard[boardCard.length - 1];
            boardCard.splice(boardCard.length - 1, 1);
          }
          break;
        }
      }
    }
  }
  if (d > 12) {
    for (let index = 12; index < 15; index++) {
      let last_div = document.getElementById(index.toString());
      last_div.remove();
    }
    let board_class = document.getElementById('board_15');
    board_class.id = 'board'
  }
    lastSet();
  checkCard.splice(0, 3);
  d = 12;
  set = false;
  let corrects = document.getElementsByClassName('correct');
  let correctsArray = Array.from(corrects);
  correctsArray.forEach(function (corrects) {
    corrects.classList.remove('correct');
  });

}
function lastSet() {//function that display the latest corrected set on the side in the bar
  document.getElementById('img1').src=checkCard[0].src;
  document.getElementById('img2').src=checkCard[1].src;
  document.getElementById('img3').src=checkCard[2].src;
}
function addPoints() {//function that adds and update points by the selcted level in every time he found a set
  let score = document.getElementById('score');
  if (flag == 1) {
    points += 200;
  }
  else if (flag == 2) {
    points += 250;
  }
  score.textContent = points;
}
function popUp(){//creating a popup  window and popping it at the end of the game
  let sound = new Audio('../audio/finish.mp3');
  sound.play();
  let divPop=document.createElement('div');
  divPop.id='divPop';
  document.body.appendChild(divPop);
  saveRecords();
  printRecord();
  stopTimer();
  let divicons=document.createElement('div');
  divPop.appendChild(divicons);
  divicons.id='divicons';
  let linkHome=document.createElement('a');
  linkHome.href='../page-html/homepage.html';
  let home=document.createElement('img')
  home.src='../img/home (1).png';
  home.classList.add('icons');
  let linkPlay=document.createElement('a');
  if(flag==1){
  linkPlay.href='../page-html/game.html?=1';}
  else{
    linkPlay.href='../page-html/game.html?=2';
  }
  let play=document.createElement('img')
  play.src='../img/play-button.png';
  play.classList.add('icons');
  let linkCup=document.createElement('a');
  linkCup.href='../page-html/records.html';
  let cup=document.createElement('img')
  cup.src='../img/trophy.png';
  cup.classList.add('icons');
  divicons.appendChild(linkHome);
  divicons.appendChild(linkPlay);
  divicons.appendChild(linkCup);
  linkHome.appendChild(home);
  linkPlay.appendChild(play);
  linkCup.appendChild(cup);
  setTimeout(function() {
    divPop.classList.add('show');
}, 100);
  for (let z = 0; z <d; z++) {
    document.getElementById(z.toString()).removeEventListener("click",selectCards);
    }
    document.getElementById('end_game').removeEventListener("click",popUp);
    document.getElementById('add_3').removeEventListener("click",add);
}
function printRecord(){//function that print the game data at the end of the game on the popup window
   let game_over=document.createElement('p');
  let divPop= document.getElementById('divPop')
  divPop.appendChild(game_over);
   game_over.classList.add('game_over');
   game_over.textContent="Game Over !!";
   let divRecords=document.createElement('div');
   divPop.appendChild(divRecords);
   divRecords.style="margin-top: -6vh;";
   divRecords.id='divRecords';
   let userName=document.createElement('p');
   userName.textContent=`user name : ${localStorage.getItem("user")}`;
   let userPoints=document.createElement('p');
   userPoints.textContent=`points:     ${points}`;
   let userTime=document.createElement('p');
   userTime.textContent=`total time :    ${document.getElementById('time').textContent}`;
   userName.classList.add('pRecords');
   userTime.classList.add('pRecords');
   userPoints.classList.add('pRecords');
   divRecords.appendChild(userName);
   divRecords.appendChild(userPoints);
   divRecords.appendChild(userTime);
}
function saveRecords() {//save the records for the records board
  const existingRecords = JSON.parse(localStorage.getItem("gameRecords") || "[]");
  existingRecords.unshift({
    userName: localStorage.getItem("user"),
    points: points,
    time: document.getElementById('time').textContent
  });
  while (existingRecords.length > 3) {
    existingRecords.pop();
  }
  localStorage.setItem("gameRecords", JSON.stringify(existingRecords));
}
function add() {//function that adds cards to the board as long as the amount of cards on the board smaller than 15 
                //and there are cards to add to the array
   let index;
  if (d < 15 && points >= 30&&arrayCards.length>=3) {
    for (index = d; index < d + 3; index++) {
      let rand = Math.floor(Math.random() * (arrayCards.length - 1));
      let img = document.createElement("img");
      img.classList.add("img_card");
      img.src = arrayCards[rand].src;
      img.id = index;
      let div = document.createElement("div");
      div.appendChild(img);
      document.getElementById('board').appendChild(div);
      div.addEventListener("click", selectCards);
      boardCard[index] = arrayCards[rand];
      arrayCards.splice(rand, 1);
      document.getElementById('board').appendChild(div);
    }
    d = index;
    let board_class = document.getElementById('board');
    board_class.id = 'board_15'
    points -= 30;
    let score = document.getElementById('score');
    score.textContent = points;
  }
}
function Hearts(pHeart) {//function that creating hearts at the start of the game
  let div1 = document.createElement("div");
  pHeart.appendChild(div1);
  div1.classList.add('heart');
  div1.textContent = "❤";
  let div2 = document.createElement("div");
  pHeart.appendChild(div2);
  div2.classList.add('heart');
  div2.textContent = "❤";
  let div3 = document.createElement("div");
  pHeart.appendChild(div3);
  div3.classList.add('heart');
  div3.textContent = "❤";
  if (flag == 1) {
    let div4 = document.createElement("div");
    pHeart.appendChild(div4);
    div4.classList.add('heart');
    div4.textContent = "❤";
  }
}
function removeHeart() {//delete a heart in case the player was wrong if the hearts run out the game is over 
  let remHeart = document.getElementById('divHearts');
  console.log(remHeart.children.length);
  if (remHeart.children.length > 0) {
    remHeart.removeChild(remHeart.firstChild);
  }
  if (remHeart.children.length == 0) {
    popUp();
  }

}
function bar() {//creating a bar where all  the data is displayed during the game
  let home = document.createElement("a");
  let homeImg = document.createElement("img");
  homeImg.src = "../img/Home.png";
  homeImg.id = "homeImg";
  home.href = "../page-html/homepage.html";
  home.appendChild(homeImg);
  document.body.appendChild(home);
  let divbar = document.createElement("div");
  divbar.id = "bar";
  document.body.appendChild(divbar);
  const pTime = document.createElement("h1");
  pTime.textContent = "🕧time:";
  let time = document.createElement("h6");
     time.id = "time";
     time.textContent= "00:00"; 
  divbar.appendChild(pTime);
  divbar.appendChild(time);
  const pScore = document.createElement("h1");
  divbar.appendChild(pScore);
  pScore.textContent = "🏆score:";
  let score = document.createElement("h3");
  pScore.appendChild(score);
  score.textContent = points.toString();
  score.id = "score";
  let pHearts = document.createElement("div");
  divbar.appendChild(pHearts);
  pHearts.id = "divHearts";
  Hearts(pHearts);
  let last_set = document.createElement('div');
  last_set.id="last_set"
  let div1 = document.createElement('div');
  let img1=document.createElement('img');
 img1.classList.add('lastSet');
  div1.appendChild(img1);
  let div2 = document.createElement('div');
  let img2=document.createElement('img');
  div2.appendChild(img2);
  img2.classList.add('lastSet');
  let div3 = document.createElement('div');
  let img3=document.createElement('img');
  div3.appendChild(img3);
  img3.classList.add('lastSet');
  last_set.id = 'last_set'
  img1.id="img1";
  img2.id="img2";
  img3.id="img3";
  img1.src='../img/question-mark.png';
  img2.src='../img/question-mark.png';
  img3.src='../img/question-mark.png';
  divbar.appendChild(last_set);
  last_set.appendChild(div1);
  last_set.appendChild(div2);
  last_set.appendChild(div3);
  let divButtons=document.createElement('div');
  divbar.appendChild(divButtons);
  const Add_3 = document.createElement("button");
  divButtons.appendChild(Add_3);
  divButtons.id='divButtons';
  divButtons.style='margin-left: 3.5vw;'
  Add_3.textContent = "add 3 cards";
  Add_3.classList.add("buttons");
  Add_3.id = "add_3";
  Add_3.addEventListener("click", add);
  const end = document.createElement("button");
  divButtons.appendChild(end);
  end.textContent = "end game"
  end.classList.add("buttons");
  end.id = "end_game";
  end.addEventListener("click",popUp);
}
function Time(timeBegin) {//a timer that count the duration of the game
  let timer = timeBegin;
  let minutes, seconds;
  intervalId = setInterval(function() {
      minutes = Math.floor((timer % 3600) / 60);
      seconds = timer % 60;
      minutes = String(minutes).padStart(2, "0");
      seconds = String(seconds).padStart(2, "0");
      time.textContent = `${minutes}:${seconds}`;
      timer++; 
  }, 1000);
}
function stopTimer() {//stop the timer when the game is over
  if (intervalId) {
    clearInterval(intervalId);
  }
}