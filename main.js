//______________________________________________________________________________________________________________________
//SANJAY JS
//______________________________________________________________________________________________________________________

//___________________________________________________GLOBAL vars

const fullCourseList = ["COMP 1020", "MATH 1510", "CHEM 1300", "PHYS 1020"];
var selectedCourseList = [];

//__________________________________________________ INIT autocomplete input

function getFullCouseList() {
  var input = document.getElementById("input");
  var awesomplete = new Awesomplete(input, {
    minChars: 1,
    maxItems: 5,
    autoFirst: true
  });
  awesomplete.list = fullCourseList;
}

//___________________________________________________START: Mouse Over and Out for course cards

function mouseOverCourse() {
  this.className += " course-hover";
}

function mouseOutCourse() {
  this.className = "course";
}
function cursorGrabbing() {
  this.className = "course course-hover course-hold";
}
function cursorGrab() {
  this.className = "course course-hover";
}
//___________________________________________________END: Mouse Over and Out for course cards

//__________________________________________________ START: Add new Course

const adder = document.querySelector(".add");
adder.addEventListener("click", addNewCourse);

function enterCourseKeyListener(e) {
  if (e.key === "Enter") {
    addNewCourse();
  }
}

function addNewCourse() {
  var newItem = document.querySelector(".input").value;
  if (
    !fullCourseList.includes(newItem) ||
    selectedCourseList.includes(newItem)
  ) {
    alert("FATAL ERROR!!!!!");
    return;
  }
  document.querySelector(".input").value = "";

  var ul = document.getElementById("sortable");

  var li = document.createElement("li");
  li.innerHTML = newItem;
  li.setAttribute("class", "course");

  var button = document.createElement("button");
  button.innerHTML = "hi";
  button.setAttribute("class", "accordian");

  li.appendChild(button);

  var panel = document.createElement("div");
  panel.setAttribute("class", "panel");

  var para = document.createElement("p");
  para.innerHTML = `                
  Lorem ipsum<br />
  consectetur <br />
  eiusmod tempor <br />
  labore et dolore <br />
  enim ad minim <br />
  nostrud <br />
  nisi ut <br />`;

  panel.appendChild(para);

  li.appendChild(panel);
  ul.appendChild(li);
  button.addEventListener("click", openCourseInfoPanel);
  li.addEventListener("mousedown", cursorGrabbing);
  li.addEventListener("mouseup", cursorGrab);
  li.addEventListener("mouseover", mouseOverCourse);
  li.addEventListener("mouseout", mouseOutCourse);
  selectedCourseList.push(newItem);
}
//__________________________________________________END: Add new Course

function sendPriorityList() {
  var listItems = document.querySelectorAll(".course");
  console.log("PRIORITY LIST");
  listItems.forEach(item => {
    console.log(item.innerHTML);
  });
}

//___________________________________________________________
var acc = document.getElementsByClassName("accordian");
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", openCourseInfoPanel);
}

function openCourseInfoPanel() {
  console.log("click");
  this.classList.toggle("active");
  var panel = this.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
}
