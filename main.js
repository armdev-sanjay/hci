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

  
  
  
  
  //______________________________________________________________________________________________________________________
  //SKYLAR JS
  //______________________________________________________________________________________________________________________
  

  allSchedules = new Array();   //to hold all possible schedules to be presenter to the user.



  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~CONSTRUCTORS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



  /*
    object which contains a possible schedule to be presented to the user. 
    holds a timetable in encoded binary array form, and  all course sections contained in the schedule.
    (CURRENTLY NOT A COPY)
  */
  function Schedule(){

    this.times = [0, 0 ,0 ,0 ,0];
    this.sections = new Array(); 


  }//schedule



  /*
    object to contain a section's information 
  */
  function courseSection(code, name, number, times, labrequired, instructor, location, detailedInfo) {
  
    this.courseCode = code;       //eg: COMP 3020
    this.courseName = name;       
    this.number = number;           //section number (ie: A01)
    this.times = times;            //time(s) of class (encoded bitfield)
    this.labRequired = labrequired;      //boolean of if a lab section is required for this class
    this.instructor = instructor;       
    this.location = location;
    this.detailedInfo = detailedInfo;     //somehow link or list information needed for detailed info section?

  }//courseSection




  /*
    object to contain a lab section's information.
    Linked list structure of all possible sections at same priority level.
  */
  function labSection(code, name, number, times, instructor, location, detailedInfo){

    this.courseCode = code;
    this.courseName = name;
    this.number = number;
    this.times = times;
    this.instructor = instructor;
    this.location = location;
    this.detailedInfo = detailedInfo;


  }//labSection




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~METHODS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




/*
  Creates all schedules possible with given priority list. Returns them as a lits of schedule objects(??)
  Maxes out at 5 classes
*/
function createSchedules(priorityList){

  const maximum = 5; //maximum number of courses to add to a single schedule
  let numAdded = 0;  //keeps track of how many courses have been added to this schedule


  //create schedules
  while(numAdded == 0){



  }//while

  for(object of priorityList){}

}//createSchedules




/*
  recursive function to add courses to the schedule, and create divergent schedules

*/
function addLayer(priorityList, schedule, depth){

  for(object in priorityList[depth]){
    if(!conflictExists(schedule.times, object.times)){
      addLayer(priorityList, newSchedule(schedule, object), depth+1);
    }

  }//for




}//addLayer


/*
  creates and returns a new Schedule. if "oldSchedule" is null, a new Schedule is created with the 
  first item being "nextSection". Otherwise a cope of "oldSchedule" is made, and next section added to it.
*/
function newSchedule(oldSchedule, nextSection){

  if(oldSchedule == null){
    return(addSection(new Schedule(), nextSection));
  }else{
    return(addSection(JSON.parse(JSON.stringify(oldSchedule)), nextSection));
  }

}//newSchedule





/*
  DOES NOT CHECK IF VALID. ENSURE ONLY SECTIONS WHICH CAN BE ADDED ARE GIVEN.
  adds a given section (courseSection) to the given Schedule (schedule).
  adds the time to schedule's times array, and a copy of the course section to the sections list. 
*/
function addSection(schedule, courseSection){

  addToPlanner(schedule.times, courseSection.times);  //adds the class times to the schedule.
  schedule.sections.push(JSON.parse(JSON.stringify(courseSection)));  //add a copy of the course to the schedule

  return schedule;

}//addSection






/*
  compares two times and returns a boolean of if they conflict (true) or not (false).
  expects both inputs to be encoded binary arrays.
*/
function conflictExists(section1, section2){

  //check each day for conflict. return true as soon as one is found.
  for(day = 0; day<5; day++){
    if((section1[day]&section2[day]) >0){
      return true;
    }
  }
  //if no conflict has been found, return false
  return false;

}//conflictExists





/*
  adds time slots from "toAdd" encoded binary array to "planner" encoded binary array.
  DOES NOT CHECK FOR CONFLICTS. DOES NOT STORE ANY EXTRA INFORMATION.
  expects binary encoded arrays for both inputs. if intending to add one "day", create an array of one.
*/
function addToPlanner(planner, toAdd){

  //simply ORs each day together to combine bitwise values.
  for(day = 0; day<5; day++){
    planner[day] = (planner[day]|toAdd[day]);
  }

}//addToPlanner



/*
  checks all items of same horizontal priority, in order, and returns boolean of
  if any class fits with current schedule (true), or if none do (false)
  Requires the current schedule first as binary encoded array, and "card" which is a list of 
  all sections in horizontal priority
*/
function cardWorks(planner, cardToCheck){



}//cardWorks










/*
  Converts given array of binary numbers to humaan-readable times
  Expects binary numbers in format [m:0b1, t: 0b10, w: 0b11, r: 0b100, f: 0b101]
  Return string of format "M: 8:30-9:20 W: 8:30-9:20 "
  
*/
function binaryToDate(binaryArray){

  const dayLetter = ["M", "Tu", "W", "Th", "F"];
  let theTime = new String; //to return once time is in readable form
  var checker = 0b1000000;  

for (day = 0; day<5; day++){
  let dayCheck = day;
  if (dayCheck%2 ==0){ //MWF days:
  checker = 0b1000000;        //7 time slots for MWF (6 + lab)

  while(checker>0b0){//check full day (for multiple time slots)

  //find first occupied time slot (start time)
  while(((binaryArray[day]&checker)==0)&&(checker>0b0)){
    checker = checker >> 1;         
    //console.log("loop 1 " + checker);
  }
  switch(checker){
    case (0b1000000):
      theTime += dayLetter[day] + ": 8:30-";
      break;
    case (0b0100000):
      theTime += dayLetter[day] + ": 9:30-";
      break;
    case (0b0010000):
      theTime += dayLetter[day] + ": 10:30-";
      break;
    case (0b0001000):
      theTime += dayLetter[day] + ": 11:30-";
      break;
    case (0b0000100):
      theTime += dayLetter[day] + ": 12:30-";
      break;
    case (0b0000010):
      theTime += dayLetter[day] + ": 1:30-";
      break;
    case (0b0000001):
      theTime += dayLetter[day] + ": 2:30-";
      break;
    default:
      checker = -1; //no time that day
      break;
  }
  //find next not-occupied time slot (end time)
  while(((binaryArray[day]&checker)!=0)&&(checker>0b0)){
    checker = checker >> 1;                   
    //console.log("loop 2 " + checker);
  }
  switch(checker){
    case (0b0100000):
      theTime += "9:20 ";
      break;
    case (0b0010000):
      theTime += "10:20 ";
      break;
    case (0b0001000):
      theTime += "11:20 ";
      break;
    case (0b0000100):
      theTime += "12:20 ";
      break;
    case (0b0000010):
      theTime += "1:20 ";
      break;
    case (0b0000001):
      theTime += "2:20 ";
      break;
    default:
      if (checker != -1){
        theTime += "5:20 ";
      }
    break;
  }
  }//while
  }else{  //TuTh days:
  checker = 0b10000;          //5 time slots for TuTh days (4 + lab)

  while(checker>0b0){//check full day (for multiple time slots)
    //find start time of class
    while(((binaryArray[day]&checker)==0)&&(checker>0b0)){
      checker = checker >> 1; 
      //console.log("loop 3 " + checker);                  
    }
    switch(checker){
      case (0b10000):
        theTime += dayLetter[day] + ": 8:30-";
        break;
      case (0b01000):
        theTime += dayLetter[day] + ": 10:00-";
        break;
      case (0b00100):
        theTime += dayLetter[day] + ": 11:30-";
        break;
      case (0b00010):
        theTime += dayLetter[day] + ": 1:00-";
        break;
      case (0b00001):
        theTime += dayLetter[day] + ": 2:30-";
        break;
      default:
        checker = -1; //no time that day
        break;
    }
    //find next not-occupied time slot (end time)
    while(((binaryArray[day]&checker)!=0)&&(checker>0b0)){
      checker = checker >> 1;  
      //console.log("loop 4 " + checker);                 
    }
    switch(checker){
      case (0b01000):
        theTime += "9:45 ";
        break;
      case (0b00100):
        theTime += "11:15 ";
        break;
      case (0b00010):
        theTime += "12:45 ";
        break;
      case (0b00001):
        theTime += "2:15 ";
        break;
      default:
        if (checker != -1){
          theTime += "5:20 ";
        }
      break;
    }



  }//while
  }//else
}//for

  return theTime;
}//binaryToDate






  


  //~~~~~~~~~~~~~~~~EXAMPLE COURSE DATABASE~~~~~~~~~~~~~~

const m0 = 0b0000000;
const m1 = 0b1000000;
const m2 = 0b0100000;
const m3 = 0b0010000;
const m4 = 0b0001000;
const m5 = 0b0000100;
const m6 = 0b0000010;
const m7 = 0b0000001;
const t0 = 0b00000;
const t1 = 0b10000;
const t2 = 0b01000;
const t3 = 0b00100;
const t4 = 0b00010;
const t5 = 0b00001;


priorityList = []; //to hold list of addded classes

  //Math 1500:
  let card1 = [new courseSection("MATH 1500", "Introduction to Calculus", "A01", [m1, t0, m1, t0, m1], 
                                    true, "Professor Professorson", "Armes 204", "more")];
  card1.push(new courseSection("MATH 1500", "Introduction to Calculus", "A02", [m3, t0, m3, t0, m3], 
  true, "Professor Professorson", "Armes 202", "more"));
  card1.push(new courseSection("MATH 1500", "Introduction to Calculus", "A03", [m0, t1, m0, t1, m0], 
  true, "Professor Professorson", "Armes 204", "more"));
  card1.push(new courseSection("MATH 1500", "Introduction to Calculus", "A04", [m0, t3, m0, t3, m0], 
  true, "Professor Professorson", "Armes 202", "more"));

  card1.push(new labSection("MATH 1500", "Introduction to Calculus", "B01", [m0, t4, m0, t0, m0], 
                                    "Tiyae smartypants", "Machray Hall 315", "more", ));
  card1.push(new labSection("MATH 1500", "Introduction to Calculus", "B02", [m0, t0, m2, t0, m0], 
                                    "Tiyae smartypants", "Machray Hall 415", "more", ));

  

 //English 1400:
 let card2 = [new courseSection("ENGL 1400", "Literature in Books", "A01", [m5, t0, m5, t0, m5], 
 false, "Professor Professorson", "Tier 456", "more")];
card2.push(new courseSection("ENGL 1400", "Literature in Books", "A02", [m3, t0, m3, t0, m3], 
false, "Brooke Reader", "Tier 345", "more"));
card2.push(new courseSection("ENGL 1400", "Literature in Books", "A03", [t3, m0, t3, m0, t3], 
false, "Brooke Reader", "Tier 234", "more"));
card2.push(new courseSection("ENGL 1400", "Literature in Books", "A04", [m0, t2, m0, t2, m0], 
false, "Mae Daproph", "Tier 456", "more"));
card2.push(new courseSection("ENGL 1400", "Literature in Books", "A05", [m2, t0, m2, t0, m2], 
 false, "Tiyae smartypants", "Tier 345", "more", ));



 //Comp 1010:
 let card3 = [new courseSection("COMP 1010", "Introduction to Programming", "A01", [m2, t0, m2, t0, m2], 
 true, "Alan Turing", "Buhler 210", "more")];
card3.push(new courseSection("COMP 1010", "Introduction to Programming", "A02", [m6, t0, m6, t0, m6], 
true, "George Boole", "Buhler 210", "more"));
card3.push(new courseSection("COMP 1010", "Introduction to Programming", "A03", [m4, t0, m4, t0, m4], 
true, "Ada Lovelace", "Buhler 210", "more"));
card3.push(new courseSection("COMP 1010", "Introduction to Programming", "A04", [m0, t4, m0, t4, m0], 
true, "Gord Boyer", "Buhler 210", "more"));

card3.push(new labSection("COMP 1010", "Introduction to Programming", "B01", [m3, t0, m0, t0, m0], 
 "Tiyae smartypants", "Machray Hall 115", "more", ));
card3.push(new labSection("COMP 1010", "Introduction to Programming", "B02", [m4, t0, m0, t0, m0], 
 "Tiyae smartypants", "Machray Hall 112", "more", ));
card3.push(new labSection("COMP 1010", "Introduction to Programming", "B03", [m5, t0, m0, t0, m0], 
 "Tiyae smartypants", "Machray Hall 112", "more", ));
card3.push(new labSection("COMP 1010", "Introduction to Programming", "B04", [m6, t0, m0, t0, m0], 
 "Tiyae smartypants", "Machray Hall 115", "more", ));




 //Philosophy 1300:
 let card4 = [new courseSection("PHIL 1300", "Critical Considering", "A01", [m3, t0, m3, t0, m3], 
 false, "Professor Professorson", "Tier 456", "more")];
card4.push(new courseSection("PHIL 1300", "Critical Considering", "A02", [m0, t4, m0, t4, m0], 
false, "Mae Daproph", "Tier 345", "more"));
card4.push(new courseSection("PHIL 1300", "Critical Considering", "A03", [m6, t0, m6, t0, m6], 
false, "Mae Daproph", "Tier 234", "more"));


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END OF EXAMPLE DATABASE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~







//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




  //______________________________________________________________________________________________________________________
  //YUNI JS
  //______________________________________________________________________________________________________________________
  
=======
}
