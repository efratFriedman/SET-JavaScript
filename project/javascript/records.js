"use strict"
printRecords();
function printRecords() {
    const records = JSON.parse(localStorage.getItem("gameRecords") || "[]");
    const rankDiv = document.getElementById("rank");
    rankDiv.innerHTML = ''; // clearing existing content
  
    //Creating three divs for the first three records
    records.slice(0, 3).forEach((record, index) => {
      let recordDiv = document.createElement('div');
      recordDiv.classList.add('recordsPrint')
      recordDiv.textContent = `name:  ${record.userName}  points:  ${record.points}  time:  ${record.time}`;
      recordDiv.style='word-spacing: 2px;';
      rankDiv.appendChild(recordDiv);
    });
  }
  



