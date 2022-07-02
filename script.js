let addBtn = document.querySelector(".add-btn");
let modelCont = document.querySelector(".model-cont");
let mainCont = document.querySelector(".main-cont");

let colors = ["lightpink", "lightgreen", "lightblue", "black"];
let modelPriorityColor = colors[colors.length - 1]; //black

let allPriorityColors = document.querySelectorAll(".priority-color");
let addFlag = false;
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let removeFlag = false;
let removeBtn = document.querySelector(".remove-btn");

let taskAreaCont = document.querySelector(".textarea-cont");
let toolBoxColors = document.querySelectorAll('.color')


let ticketsArr = []

//local storage 
if(localStorage.getItem('tickets')){
  ticketsArr = JSON.parse(localStorage.getItem('tickets'))
  ticketsArr.forEach(function(ticket){
    createTicket(ticket.ticketColor , ticket.ticketTask , ticket.ticketId)
  })
}

//Filter tickets with respect to colors

for(let i=0;i<toolBoxColors.length;i++){
  toolBoxColors[i].addEventListener('click',function(e){
    let currentToolBoxColor = toolBoxColors[i].classList[0];
    // console.log(currentToolBoxColor)


    let filteredTickets = ticketsArr.filter(function(ticketObj){
      return ticketObj.ticketColor === currentToolBoxColor
    })

    //remove previous tickets
    let allTickets = document.querySelectorAll(".ticket-cont")
    for(let i=0;i<allTickets.length;i++){
      allTickets[i].remove()
    }

    //filtered ticket Display
    filteredTickets.forEach(function(filteredObj){
      createTicket(filteredObj.ticketColor,filteredObj.ticketTask,filteredObj.ticketId)
    });



  });
  toolBoxColors[i].addEventListener('dblclick',function(e){
    let allTickets = document.querySelectorAll(".ticket-cont")
    for(let i=0;i<allTickets.length;i++){
      allTickets[i].remove()
    }

    ticketsArr.forEach(function(TicketObj){
      createTicket(TicketObj.ticketColor,TicketObj.ticketTask,TicketObj.ticketId)
    });
  })
}


addBtn.addEventListener("click", function (e) {
  //Display a Model

  //flag->true  -Model Display
  //flag==false Model Hide

  addFlag = !addFlag;
  if (addFlag) {
    modelCont.style.display = "flex"; //here we are setting the display of .model-cont to flex.By default it was none-
  } else {
    modelCont.style.display = "none";
  }
});
//changing the priority colors
allPriorityColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function (e) {
    allPriorityColors.forEach(function (priorityColorElem) {
      priorityColorElem.classList.remove("active");
    });
    colorElem.classList.add("active");
    modelPriorityColor = colorElem.classList[0];
  });
});

//Generating a ticket
modelCont.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key == "Shift") {
    createTicket(modelPriorityColor, taskAreaCont.value);
    modelCont.style.display = "none";
    addFlag = false;
    taskAreaCont.value = "";
  }
});

function createTicket(ticketColor, ticketTask, ticketId) {
  let id = ticketId || shortid()
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
  <div class="ticket-id">#${id}</div>
  <div class="ticket-area" spellcheck="false">${ticketTask}</div>
  <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
  </div>`;

  mainCont.appendChild(ticketCont);
  handleRemoval(ticketCont,id);

  handleLock(ticketCont,id);
  handleColor(ticketCont,id);
  if(!ticketId){
    ticketsArr.push({ticketColor,ticketTask,ticketId:id})
    localStorage.setItem('tickets' , JSON.stringify(ticketsArr))
  }

  
}

removeBtn.addEventListener("click", function (e) {
  removeFlag = !removeFlag;
  if (removeFlag == true) {
    removeBtn.style.color = "red";
  } else {
    removeBtn.style.color = "#2c2c54";
  }
});

//Remove Tickets Function
function handleRemoval(ticket,id) {
  ticket.addEventListener("click", function () {
    if (!removeFlag) {
      return;
    }

    let idx = getTicketIdx(id)

    // local storage se removal

    ticketsArr.splice(idx,1);

    let strTicketArray = JSON.stringify(ticketsArr);
    localStorage.setItem('tickets',strTicketArray)

    ticket.remove()
  });
}


// Lock and Unlock Tickets
function handleLock(ticket,id) {
  let ticketLockElem = ticket.querySelector(".ticket-lock");

  let ticketLock = ticketLockElem.children[0];
  let ticketTaskArea = ticket.querySelector(".ticket-area");

  ticketLock.addEventListener("click", function (e) {
    let ticketIdx = getTicketIdx(id);
    if (ticketLock.classList.contains(lockClass)) {
      ticketLock.classList.remove(lockClass);
      ticketLock.classList.add(unlockClass);
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLock.classList.remove(unlockClass);
      ticketLock.classList.add(lockClass);
      ticketTaskArea.setAttribute("contenteditable", "false");
    }
    ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
    localStorage.setItem('tickets',JSON.stringify(ticketsArr));

  });
}




function handleColor(ticket,id) {
  let ticketColorBand = ticket.querySelector(".ticket-color");

  ticketColorBand.addEventListener("click", function (e) {
    let currentTicketColor = ticketColorBand.classList[1];

    let ticketIdx = getTicketIdx(id)


    let currentTicketColoridx = colors.findIndex(function (color) {
      return currentTicketColor === color;
    });

    currentTicketColoridx++;

    let newTicketColorIdx = currentTicketColoridx % colors.length;
    let newTicketColor = colors[newTicketColorIdx];

    ticketColorBand.classList.remove(currentTicketColor);
    ticketColorBand.classList.add(newTicketColor);


    //modify with new color 
    ticketsArr[ticketIdx].ticketColor = newTicketColor;
    localStorage.setItem('tickets',JSON.stringify(ticketsArr))
  });
}

function getTicketIdx(id){
  let ticketIdx = ticketsArr.findIndex(function(ticketObj){
      return ticketObj.ticketId === id;
  })
  return ticketIdx
}