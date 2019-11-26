//___________________________________________________GLOBAL vars
var selectedCourseList = [];
var fullCourseList = [];
var fullCourseNames = [];
var fullCourseObject = {};
var priorityList = [];
var schedules = [];
var schedNum = 0;
//________________________________________

var items = document.getElementById("items");

function getFullCourseList() {
  makeFullCourseList();
  makeFullCourseObject();
  var input = document.getElementById("input");
  var awesomplete = new Awesomplete(input, {
    minChars: 1,
    maxItems: 5,
    autoFirst: true
  });
  awesomplete.list = fullCourseNames;
}

function updatePriorityList() {
  var courses = items.getElementsByClassName("course");
  var list = {};
  for (var i = 0; i < courses.length; i++) {
    var sections = courses[i].getElementsByClassName("section");
    var id = courses[i].id;
    list[id] = [];
    for (var j = 0; j < sections.length; j++) {
      if (!sections[j].className.includes("lock")) {
        list[id].push(sections[j].id);
      }
    }
  }

  priorityList = [];

  keys = Object.keys(list);
  keys.forEach(key => {
    card = [];
    list[key].forEach(selectedSection => {
      fullCourseObject[key].forEach(section => {
        if (selectedSection === section.number) {
          card.push(section);
        }
      });
    });
    priorityList.push(card);
  });
  createSchedules();
  updateBorders();
  renderTimtable();
  //
}

/*
  updates the borders of the cards to match the shceduled classes
*/
function updateBorders() {
  var cards = items.getElementsByClassName("course");

  let cardNum = 0;
  let sched = bestSchedules[0].sections;

  for (priorityLevel = 1; priorityLevel <= sched.length; priorityLevel++) {
    let border = "courseBorder";
    while (cards[cardNum].id != sched[priorityLevel - 1].courseCode) {
      cards[cardNum++].className = "course courseBorder0"; //update courseBorders unil matching course is found
    }
    //matching course found
    border += priorityLevel;
    cards[cardNum++].className = "course " + border;
  }
  //all scheduled courses have been found, update the rest of the borders
  while (cardNum < cards.length) {
    cards[cardNum++].className = "course courseBorder0";
  }
} //updateBorders

var sortable = new Sortable(items, {
  handle: ".my-handle",
  animation: 300,
  swapThreshold: 0.3,
  chosenClass: "chosen",
  ghostClass: "ghost",
  draggable: ".course",
  onEnd: updatePriorityList
});

var courses = document.querySelectorAll(".course");
for (var i = 0; i < courses.length; i++) {
  new Sortable(courses[i], {
    handle: ".my-handle",
    animation: 300,
    swapThreshold: 0.3,
    chosenClass: "chosen",
    ghostClass: "ghost",
    draggable: ".section",
    onEnd: updatePriorityList
  });
}

const borderGreen = function borderGreen() {
  if (input.value.length === 1) {
    input.className = "input border-searchbar";
  }
};

const addNewCourse_ = function addNewCourse_() {
  var newCourse = document.querySelector(".input").value;
  if (!validateEntry(newCourse)) return;
  addNewCourse(newCourse);
};
input.addEventListener("keydown", borderGreen);
var adder = document.getElementById("add");
adder.addEventListener("click", addNewCourse_);

window.addEventListener("click", function(e) {
  if (document.getElementById("input").contains(e.target)) {
    e.preventDefault();
    input.className = "input border-searchbar";
  } else if (adder.contains(e.target)) {
    e.preventDefault();
  } else {
    e.preventDefault();
    input.className = "input";
  }
});

function enterCourseKeyListener(e) {
  if (e.key === "Enter") {
    var newCourse = document.querySelector(".input").value;
    if (!validateEntry(newCourse)) return;
    addNewCourse(newCourse);
  }
}

function validateEntry(newCourse) {
  if (selectedCourseList.includes(newCourse)) {
    document.querySelector(".input").classList.add("focus-red");
    //TODO: show an error msg
    return false;
  }
  if (!fullCourseNames.includes(newCourse)) {
    //document.querySelector(".input").classList.add("focus-red");
    input.classList.add("focus-red");
    //TODO: show an error msg
    return false;
  }
  return true;
}

const scrollToCourseInfo = function scrollToCourseInfo() {
  var moreCourseInfo = document.getElementById("more-course-info");
  moreCourseInfo.className = "more-course-info";
  moreCourseInfo.scrollIntoView({ behavior: "smooth" });
};

function addNewCourse(newCourse) {
  var thisCourse = fullCourseObject[newCourse];

  var list = document.getElementById("items");

  var course = document.createElement("div");
  course.className = "course courseBorder1";
  course.id = thisCourse[0].courseCode;
  list.appendChild(course);

  var courseHeading = document.createElement("div");
  courseHeading.className = "heading accordion-main";
  course.appendChild(courseHeading);
  //add listeners
  courseHeading.addEventListener("mouseover", accordianHover);
  courseHeading.addEventListener("mouseout", accordianHover);
  courseHeading.addEventListener("click", openCourseAccordian);

  var dragHandle = document.createElement("span");
  dragHandle.className = "glyphicon glyphicon-align-justify my-handle";
  courseHeading.appendChild(dragHandle);

  courseHeading.innerHTML += newCourse;

  var toggleIndicator = document.createElement("span");
  toggleIndicator.className = "glyphicon glyphicon-chevron-down down";
  toggleIndicator.id = "indicator";
  courseHeading.appendChild(toggleIndicator);

  var trashButton = document.createElement("span");
  trashButton.className = "glyphicon glyphicon-trash right";
  courseHeading.appendChild(trashButton);
  //add listener
  trashButton.addEventListener("mouseover", toDelete);
  trashButton.addEventListener("mouseout", toDelete);
  trashButton.addEventListener("click", actuallyDelete);

  var courseTitleWrapper = document.createElement("div");
  courseTitleWrapper.className = "course-title-wrapper hide";
  courseTitleWrapper.id = "course-title-wrapper";
  course.appendChild(courseTitleWrapper);

  var courseTitle = document.createElement("div");
  courseTitle.className = "course-title";
  courseTitle.innerHTML = thisCourse[0].courseName;
  courseTitleWrapper.appendChild(courseTitle);

  var moreInfoBtn = document.createElement("span");
  moreInfoBtn.className = "glyphicon glyphicon-info-sign tooltip";
  moreInfoBtn.id = "more-course-info-button";
  courseTitleWrapper.appendChild(moreInfoBtn);
  moreInfoBtn.innerHTML = `<span class="tooltiptext">more course info</span>`;

  moreInfoBtn.addEventListener("click", scrollToCourseInfo);

  for (var i = 0; i < thisCourse.length; i++) {
    //--------------------
    var section = document.createElement("div");
    section.className = "section hide";
    section.id = thisCourse[i].number;
    course.appendChild(section);

    var sectionHeading = document.createElement("div");
    sectionHeading.className = "heading sectionheading accordion";
    section.appendChild(sectionHeading);
    //add listeners
    sectionHeading.addEventListener("click", openAccordian);
    sectionHeading.addEventListener("mouseover", accordianHover);
    sectionHeading.addEventListener("mouseout", accordianHover);

    var dragHandle = document.createElement("span");
    dragHandle.className = "glyphicon glyphicon-align-justify my-handle";
    sectionHeading.appendChild(dragHandle);

    sectionHeading.innerHTML += thisCourse[i].number;

    var trashButton = document.createElement("span");
    trashButton.className = "glyphicon glyphicon-ok-circle right";
    sectionHeading.appendChild(trashButton);
    //add listener
    trashButton.addEventListener("mouseover", toDisable);
    trashButton.addEventListener("mouseout", toDisable);
    trashButton.addEventListener("click", actuallyDisable);

    var sectionInfo = document.createElement("div");
    sectionInfo.className = "sectioninfo panel";
    section.appendChild(sectionInfo);

    var ul = document.createElement("ul");
    var prof = document.createElement("li");
    prof.innerHTML = thisCourse[i].instructor;
    ul.appendChild(prof);

    var location = document.createElement("li");
    location.innerHTML = thisCourse[i].location;
    ul.appendChild(location);
    sectionInfo.appendChild(ul);

    var timeString = getCardTime(thisCourse[i].times);
    console.log(timeString);
    var time = document.createElement("li");
    time.innerHTML = timeString;
    ul.appendChild(time);
    sectionInfo.appendChild(ul);

    //--------------------
  }

  new Sortable(course, {
    handle: ".my-handle",
    animation: 300,
    swapThreshold: 0.3,
    chosenClass: "chosen",
    ghostClass: "ghost",
    draggable: ".section",
    onEnd: updatePriorityList
  });

  selectedCourseList.push(thisCourse[0].courseCode);
  input.value = "";

  updatePriorityList();
}

const accordianHover = function accordianHover() {
  this.classList.toggle("accordian-hover");
};

const openCourseAccordian = function openCourseAccordian(e) {
  this.classList.toggle("active");
  this.getElementsByClassName("down")[0].classList.toggle(
    "glyphicon-chevron-down"
  );

  this.getElementsByClassName("down")[0].classList.toggle(
    "glyphicon-chevron-up"
  );
  var nodes = this.parentNode.children;
  for (var i = 1; i < nodes.length; i++) {
    nodes[i].classList.toggle("hide");
  }
};
var accmain = document.getElementsByClassName("accordion-main");
var i;

for (i = 0; i < accmain.length; i++) {
  accmain[i].addEventListener("click", openCourseAccordian);
  accmain[i].addEventListener("mouseover", accordianHover);
  accmain[i].addEventListener("mouseout", accordianHover);
}

const openAccordian = function openAccordian() {
  this.classList.toggle("active");
  var panel = this.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
};
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", openAccordian);
  acc[i].addEventListener("mouseover", accordianHover);
  acc[i].addEventListener("mouseout", accordianHover);
}

const toDelete = function toDelete() {
  this.classList.toggle("delete");
};

const actuallyDelete = function actuallyDelete(e) {
  e.stopPropagation();
  if (this.parentNode.parentNode.className.includes("course")) {
    for (var i = 0; i < selectedCourseList.length; i++) {
      if (this.parentNode.innerHTML.includes(selectedCourseList[i])) {
        selectedCourseList.splice(i, 1);
      }
    }
    this.parentNode.parentNode.remove();
    updatePriorityList();
    return;
  }
};

var trash = document.querySelectorAll(".glyphicon-trash");
for (i = 0; i < trash.length; i++) {
  trash[i].addEventListener("mouseover", toDelete);
  trash[i].addEventListener("mouseout", toDelete);
  trash[i].addEventListener("click", actuallyDelete);
}

const toDisable = function toDisable() {
  this.classList.toggle("glyphicon-ok-circle");
  this.classList.toggle("glyphicon-remove-circle");
};

const actuallyEnable = function actuallyEnable(e) {
  e.stopPropagation();
  this.parentNode.parentNode.classList.toggle("lock");
  this.parentNode.classList.toggle("accordian-hover");
  this.classList.toggle("glyphicon-ok-circle");
  this.classList.toggle("glyphicon-remove-circle");
  this.parentNode.addEventListener("mouseover", accordianHover);
  this.parentNode.addEventListener("mouseout", accordianHover);
  this.addEventListener("click", actuallyDisable);
  this.removeEventListener("click", actuallyEnable);
  updatePriorityList();
};

const actuallyDisable = function actuallyDisable(e) {
  e.stopPropagation();
  this.parentNode.parentNode.classList.toggle("lock");
  this.parentNode.classList.toggle("accordian-hover");
  this.classList.toggle("glyphicon-ok-circle");
  this.classList.toggle("glyphicon-remove-circle");
  this.parentNode.removeEventListener("mouseover", accordianHover);
  this.parentNode.removeEventListener("mouseout", accordianHover);
  this.removeEventListener("click", actuallyDisable);
  this.addEventListener("click", actuallyEnable);
  updatePriorityList();
};

var disable = document.querySelectorAll(".glyphicon-ok-circle");

for (var i = 0; i < disable.length; i++) {
  disable[i].addEventListener("mouseover", toDisable);
  disable[i].addEventListener("mouseout", toDisable);
  disable[i].addEventListener("click", actuallyDisable);
}

//_______________________________________________________________________________________________________

//_______________________________________________________________________________________________________
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~CONSTRUCTORS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
    object which contains a possible schedule to be presented to the user. 
    holds a timetable in encoded binary array form, and  all course sections contained in the schedule.
    (CURRENTLY NOT A COPY)
  */
function Schedule() {
  this.times = [0, 0, 0, 0, 0];
  this.sections = new Array();
} //schedule

/*
    object to contain a section's information 
  */
function courseSection(
  code,
  name,
  number,
  times,
  labrequired,
  instructor,
  location,
  detailedInfo
) {
  this.courseCode = code; //eg: COMP 3020
  this.courseName = name;
  this.number = number; //section number (ie: A01)
  this.times = times; //time(s) of class (encoded bitfield)
  this.labRequired = labrequired; //boolean of if a lab section is required for this class
  this.instructor = instructor;
  this.location = location;
  this.detailedInfo = detailedInfo; //somehow link or list information needed for detailed info section?
} //courseSection

/*
    object to contain a lab section's information.
    Linked list structure of all possible sections at same priority level.
  */
function labSection(
  code,
  name,
  number,
  times,
  instructor,
  location,
  detailedInfo
) {
  this.courseCode = code;
  this.courseName = name;
  this.number = number;
  this.times = times;
  this.instructor = instructor;
  this.location = location;
  this.detailedInfo = detailedInfo;
} //labSection

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~METHODS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bestPriorityValue = 0b0;

/*
    object which contains a possible schedule to be presented to the user. 
    holds a timetable in encoded binary array form, and  all course sections contained in the schedule.
    (CURRENTLY NOT A COPY)
  */
function Schedule() {
  this.times = [0, 0, 0, 0, 0];
  this.sections = new Array();
  this.priorityValue = 0; //holds the value of the schedule relative to the prioritylist.
  //Binary number, each digit represents if the associated card was added.
} //schedule

/*
  object to contain a section's information 
*/
function courseSection(
  code,
  name,
  number,
  times,
  labrequired,
  instructor,
  location,
  detailedInfo
) {
  this.courseCode = code; //eg: COMP 3020
  this.courseName = name;
  this.number = number; //section number (ie: A01)
  this.times = times; //time(s) of class (encoded bitfield)
  this.labRequired = labrequired; //boolean of if a lab section is required for this class
  this.instructor = instructor;
  this.location = location;
  this.detailedInfo = detailedInfo; //somehow link or list information needed for detailed info section?
} //courseSection

/*
    object containing information of one TIME SLOT to display on the schedue
    (ie: the wednesday lecture for math 1500).
  */
function slotToDisplay(givenName, A0X, dayAbbr, time, colourName) {
  this.name = givenName;
  this.section = A0X;
  this.day = dayAbbr;
  this.startTime = time;
  this.colour = colourName;
} //slotToDisplay

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~METHODS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
  updates global master list of display lists with current "bestSchedules" list.
*/
function getAllDisplayLists() {
  schedules = [];

  for (sched of bestSchedules) {
    schedules.push(createToDisplayList(sched.sections));
  }
} //getAllDisplayLists

/*
takes a (best) Schedule's list of sections, and returns a list of all of the sections, 
in order, with the appropriate information for the schedule visualization method.
*/
function createToDisplayList(givenList) {
  displayList = [];
  colourList = [
    "priority1",
    "priority2",
    "priority3",
    "priority4",
    "priority5"
  ];
  let colourSel = 0;
  givenList.forEach(sect => {
    let timesArray = startTimes(sect.times); //array to hold day abbrs and start time strings.
    for (i = 0; i < totalSlots(sect); i++) {
      displayList.push(
        new slotToDisplay(
          sect.courseCode,
          sect.number,
          timesArray[2 * i],
          timesArray[2 * i + 1],
          colourList[colourSel]
        )
      );
    }
    colourSel++;
  });

  return displayList;
} //toDisplayList

/*
sums up slots taken by a given section's times. and returns that integer.
*/
function totalSlots(section) {
  total = 0; //holds total sections

  //add each value of each slot in each day
  for (day of section.times) {
    toCheck = day;
    //sum time slots
    while (toCheck > 0) {
      total += toCheck & 0b01;
      toCheck = toCheck >> 1;
    }
  }

  return total;
} //totalSlots

/*
Creates all schedules possible with given priority list. Returns them as a lits of schedule objects(??)
Maxes out at 5 classes
*/
function createSchedules() {
  //const maximum = 5; //maximum number of courses to add to a single schedule
  //let numAdded = 0;  //keeps track of how many courses have been added to this schedule

  allSchedules = new Array();
  blankSchedule = new Schedule();
  bestSchedules = new Array();
  bestPriorityValue = 0;

  addLayer(priorityList, blankSchedule, 0);

  for (object of allSchedules) {
    if (object.priorityValue >= bestPriorityValue) {
      bestSchedules.push(object);
    }
  }

  /*
//output junk
for(object of bestSchedules){
  console.log(binaryToDate(object.times));
  for(object of object.sections){
    console.log(object.courseCode + " " + object.number);
  }
  console.log(" ");
}*/

  getAllDisplayLists(); //update list!

  console.log(bestSchedules.length + " schedules created.");
  return bestSchedules.length;
} //createSchedules

/*
recursive function to add courses to the schedule, and create diferent possible schedules
requires user's priorityList, a starting schedule, and int depth of starting level of priorityList
*/
function addLayer(priorityList, schedule, depth) {
  if (schedule.sections.length == 5 || priorityList.length == depth) {
    //add schedule to master list if it reached max classes, or end of priority list
    if (schedule.priorityValue >= bestPriorityValue) {
      bestPriorityValue = schedule.priorityValue;
      allSchedules.push(schedule);
    }
  } else {
    if (cardWorks(schedule.times, priorityList[depth])) {
      //recursively explore all possible schedules at next level
      for (object of priorityList[depth]) {
        if (!conflictExists(schedule.times, object.times)) {
          addLayer(
            priorityList,
            newSchedule(schedule, object, depth),
            depth + 1
          );
        }
      } //for
    } else {
      //if no classes at current level work, go to next card.
      console.log("No classes worked from card " + depth); //deal with notifying user!!
      addLayer(priorityList, schedule, depth + 1);
    }
  } //else
} //addLayer

/*
creates and returns a new Schedule. if "oldSchedule" is null, a new Schedule is created with the 
first item being "nextSection". Otherwise a copy of "oldSchedule" is made, and nextSection added to it.
*/
function newSchedule(oldSchedule, nextSection, depth) {
  if (oldSchedule == null) {
    return addSection(new Schedule(), nextSection, depth);
  } else {
    return addSection(
      JSON.parse(JSON.stringify(oldSchedule)),
      nextSection,
      depth
    );
  }
} //newSchedule

/*
DOES NOT CHECK IF VALID. ENSURE ONLY SECTIONS WHICH CAN BE ADDED ARE GIVEN.
adds a given section (courseSection) to the given Schedule (schedule).
adds the time to schedule's times array, and a copy of the course section to the sections list. 
*/
function addSection(schedule, courseSection, depth) {
  addToPlanner(schedule.times, courseSection.times); //adds the class times to the schedule.
  schedule.sections.push(JSON.parse(JSON.stringify(courseSection))); //add a copy of the course to the schedule
  if (depth != null) {
    schedule.priorityValue |= 1 << (priorityList.length - depth);
  }
  return schedule;
} //addSection

/*
compares two times and returns a boolean of if they conflict (true) or not (false).
expects both inputs to be encoded binary arrays.
*/
function conflictExists(section1, section2) {
  //check each day for conflict. return true as soon as one is found.
  for (day = 0; day < 5; day++) {
    if ((section1[day] & section2[day]) > 0) {
      return true;
    }
  }
  //if no conflict has been found, return false
  return false;
} //conflictExists

/*
adds time slots from "toAdd" encoded binary array to "planner" encoded binary array.
DOES NOT CHECK FOR CONFLICTS. DOES NOT STORE ANY EXTRA INFORMATION.
expects binary encoded arrays for both inputs. if intending to add one "day", create an array of one.
*/
function addToPlanner(planner, toAdd) {
  //simply ORs each day together to combine bitwise values.
  for (day = 0; day < 5; day++) {
    planner[day] = planner[day] | toAdd[day];
  }
} //addToPlanner

/*
checks all items of same horizontal priority, in order, and returns boolean of
if any class fits with current schedule (true), or if none do (false)
Requires the current schedule first as binary encoded array, and "card" which is a list of 
all sections in horizontal priority
*/
function cardWorks(plannerTimes, cardToCheck) {
  //check each section, and return true if any fit with current schedule.
  for (object of cardToCheck) {
    if (!conflictExists(object.times, plannerTimes)) {
      return true;
    }
  } //for

  //if no class section can fit with curent schedule, return false.
  return false;
} //cardWorks

/*
Converts given array of binary numbers to humaan-readable times
Expects binary numbers in format [m:0b1, t: 0b10, w: 0b11, r: 0b100, f: 0b101]
Return string of format "M: 8:30-9:20 W: 8:30-9:20 "

*/
function binaryToDate(binaryArray) {
  const dayLetter = ["M", "Tu", "W", "Th", "F"];
  let theTime = new String(); //to return once time is in readable form
  var checker = 0b1000000;

  for (day = 0; day < 5; day++) {
    let dayCheck = day;
    if (dayCheck % 2 == 0) {
      //MWF days:
      checker = 0b1000000; //7 time slots for MWF (6 + lab)

      while (checker > 0b0) {
        //check full day (for multiple time slots)

        //find first occupied time slot (start time)
        while ((binaryArray[day] & checker) == 0 && checker > 0b0) {
          checker = checker >> 1;
          //console.log("loop 1 " + checker);
        }
        switch (checker) {
          case 0b1000000:
            theTime += dayLetter[day] + ": 8:30-";
            break;
          case 0b0100000:
            theTime += dayLetter[day] + ": 9:30-";
            break;
          case 0b0010000:
            theTime += dayLetter[day] + ": 10:30-";
            break;
          case 0b0001000:
            theTime += dayLetter[day] + ": 11:30-";
            break;
          case 0b0000100:
            theTime += dayLetter[day] + ": 12:30-";
            break;
          case 0b0000010:
            theTime += dayLetter[day] + ": 1:30-";
            break;
          case 0b0000001:
            theTime += dayLetter[day] + ": 2:30-";
            break;
          default:
            checker = -1; //no time that day
            break;
        }
        //find next not-occupied time slot (end time)
        while ((binaryArray[day] & checker) != 0 && checker > 0b0) {
          checker = checker >> 1;
          //console.log("loop 2 " + checker);
        }
        switch (checker) {
          case 0b0100000:
            theTime += "9:20 ";
            break;
          case 0b0010000:
            theTime += "10:20 ";
            break;
          case 0b0001000:
            theTime += "11:20 ";
            break;
          case 0b0000100:
            theTime += "12:20 ";
            break;
          case 0b0000010:
            theTime += "1:20 ";
            break;
          case 0b0000001:
            theTime += "2:20 ";
            break;
          default:
            if (checker != -1) {
              theTime += "5:20 ";
            }
            break;
        }
      } //while
    } else {
      //TuTh days:
      checker = 0b10000; //5 time slots for TuTh days (4 + lab)

      while (checker > 0b0) {
        //check full day (for multiple time slots)
        //find start time of class
        while ((binaryArray[day] & checker) == 0 && checker > 0b0) {
          checker = checker >> 1;
          //console.log("loop 3 " + checker);
        }
        switch (checker) {
          case 0b10000:
            theTime += dayLetter[day] + ": 8:30-";
            break;
          case 0b01000:
            theTime += dayLetter[day] + ": 10:00-";
            break;
          case 0b00100:
            theTime += dayLetter[day] + ": 11:30-";
            break;
          case 0b00010:
            theTime += dayLetter[day] + ": 1:00-";
            break;
          case 0b00001:
            theTime += dayLetter[day] + ": 2:30-";
            break;
          default:
            checker = -1; //no time that day
            break;
        }
        //find next not-occupied time slot (end time)
        while ((binaryArray[day] & checker) != 0 && checker > 0b0) {
          checker = checker >> 1;
          //console.log("loop 4 " + checker);
        }
        switch (checker) {
          case 0b01000:
            theTime += "9:45 ";
            break;
          case 0b00100:
            theTime += "11:15 ";
            break;
          case 0b00010:
            theTime += "12:45 ";
            break;
          case 0b00001:
            theTime += "2:15 ";
            break;
          default:
            if (checker != -1) {
              theTime += "5:20 ";
            }
            break;
        }
      } //while
    } //else
  } //for

  return theTime;
} //binaryToDate

/*
  used to create an array of start days and times for a given course's time slots.
  used by the "createToDisplayList" method.
*/
function startTimes(binaryArray) {
  const dayAbbreviation = ["Mon", "Tue", "Wed", "Thr", "Fri"];
  let theTimes = []; //array of [0] day arbbr, and [1] start time strings.
  var checker = 0b1000000;

  for (day = 0; day < 5; day++) {
    let dayCheck = day;
    if (dayCheck % 2 == 0) {
      //MWF days:
      checker = 0b1000000; //7 time slots for MWF (6 + lab)

      while (checker > 0b0) {
        //check full day (for multiple time slots)

        //find first occupied time slot (start time)
        while ((binaryArray[day] & checker) == 0 && checker > 0b0) {
          checker = checker >> 1;
          //console.log("loop 1 " + checker);
        }
        switch (checker) {
          case 0b1000000:
            theTimes.push(dayAbbreviation[day], "0830");
            break;
          case 0b0100000:
            theTimes.push(dayAbbreviation[day], "0930");
            break;
          case 0b0010000:
            theTimes.push(dayAbbreviation[day], "1030");
            break;
          case 0b0001000:
            theTimes.push(dayAbbreviation[day], "1130");
            break;
          case 0b0000100:
            theTimes.push(dayAbbreviation[day], "1230");
            break;
          case 0b0000010:
            theTimes.push(dayAbbreviation[day], "1330");
            break;
          case 0b0000001:
            theTimes.push(dayAbbreviation[day], "1430");
            break;
          default:
            checker = -1; //no time that day
            break;
        }
        //find next not-occupied time slot (end time)
        //while ((binaryArray[day] & checker) != 0 && checker > 0b0) {
        checker = checker >> 1;
        //console.log("loop 2 " + checker);
        //}
      } //while
    } else {
      //TuTh days:
      checker = 0b10000; //5 time slots for TuTh days (4 + lab)

      while (checker > 0b0) {
        //check full day (for multiple time slots)
        //find start time of class
        while ((binaryArray[day] & checker) == 0 && checker > 0b0) {
          checker = checker >> 1;
          //console.log("loop 3 " + checker);
        }
        switch (checker) {
          case 0b10000:
            theTimes.push(dayAbbreviation[day], "0830");
            break;
          case 0b01000:
            theTimes.push(dayAbbreviation[day], "1000");
            break;
          case 0b00100:
            theTimes.push(dayAbbreviation[day], "1130");
            break;
          case 0b00010:
            theTimes.push(dayAbbreviation[day], "1300");
            break;
          case 0b00001:
            theTimes.push(dayAbbreviation[day], "1430");
            break;
          default:
            checker = -1; //no time that day
            break;
        }
        //find next not-occupied time slot (end time)
        //while ((binaryArray[day] & checker) != 0 && checker > 0b0) {
        checker = checker >> 1;
        //console.log("loop 4 " + checker);
        //}
      } //while
    } //else
  } //for

  return theTimes;
} //timeStart

//_______________________________________________________________________________________________________

//_______________________________________________________________________________________________________

function makeFullCourseObject() {
  fullCourseList.forEach(course => {
    fullCourseNames.push(course[0].courseCode);
    fullCourseObject[course[0].courseCode] = course;
  });
}

function makeFullCourseList() {
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

  //Math 1500:
  const card1 = [
    new courseSection(
      "MATH 1500",
      "Introduction to Calculus",
      "A01",
      [m1, t4, m1, t0, m1],
      true,
      "Professor Professorson",
      "Armes 204",
      "more"
    )
  ];
  card1.push(
    new courseSection(
      "MATH 1500",
      "Introduction to Calculus",
      "A02",
      [m3, t0, m3 | m2, t0, m3],
      true,
      "Professor Professorson",
      "Armes 202",
      "more"
    )
  );
  card1.push(
    new courseSection(
      "MATH 1500",
      "Introduction to Calculus",
      "A03",
      [m0, t1 | t4, m0, t1, m0],
      true,
      "Professor Professorson",
      "Armes 204",
      "more"
    )
  );
  card1.push(
    new courseSection(
      "MATH 1500",
      "Introduction to Calculus",
      "A04",
      [m0, t3, m2, t3, m0],
      true,
      "Professor Professorson",
      "Armes 202",
      "more"
    )
  );

  //English 1400:
  const card2 = [
    new courseSection(
      "ENGL 1400",
      "Literature in Books",
      "A01",
      [m5, t0, m5, t0, m5],
      false,
      "Professor Professorson",
      "Tier 456",
      "more"
    )
  ];
  card2.push(
    new courseSection(
      "ENGL 1400",
      "Literature in Books",
      "A02",
      [m3, t0, m3, t0, m3],
      false,
      "Brooke Reader",
      "Tier 345",
      "more"
    )
  );
  card2.push(
    new courseSection(
      "ENGL 1400",
      "Literature in Books",
      "A03",
      [m0, t3, m0, t3, m0],
      false,
      "Brooke Reader",
      "Tier 234",
      "more"
    )
  );
  card2.push(
    new courseSection(
      "ENGL 1400",
      "Literature in Books",
      "A04",
      [m0, t2, m0, t2, m0],
      false,
      "Mae Daproph",
      "Tier 456",
      "more"
    )
  );
  card2.push(
    new courseSection(
      "ENGL 1400",
      "Literature in Books",
      "A05",
      [m2, t0, m2, t0, m2],
      false,
      "Tiyae smartypants",
      "Tier 345",
      "more"
    )
  );

  //Comp 1010:
  const card3 = [
    new courseSection(
      "COMP 1010",
      "Introduction to Programming",
      "A01",
      [m2 | m3, t0, m2, t0, m2],
      true,
      "Alan Turing",
      "Buhler 210",
      "more"
    )
  ];
  card3.push(
    new courseSection(
      "COMP 1010",
      "Introduction to Programming",
      "A02",
      [m6 | m4, t0, m6, t0, m6],
      true,
      "George Boole",
      "Buhler 210",
      "more"
    )
  );
  card3.push(
    new courseSection(
      "COMP 1010",
      "Introduction to Programming",
      "A03",
      [m4 | m5, t0, m4, t0, m4],
      true,
      "Ada Lovelace",
      "Buhler 210",
      "more"
    )
  );
  card3.push(
    new courseSection(
      "COMP 1010",
      "Introduction to Programming",
      "A04",
      [m6, t4, m0, t4, m0],
      true,
      "Gord Boyer",
      "Buhler 210",
      "more"
    )
  );

  //Philosophy 1300:
  const card4 = [
    new courseSection(
      "PHIL 1300",
      "Critical Considering",
      "A01",
      [m3, t0, m3, t0, m3],
      false,
      "Professor Professorson",
      "Tier 456",
      "more"
    )
  ];
  card4.push(
    new courseSection(
      "PHIL 1300",
      "Critical Considering",
      "A02",
      [m0, t4, m0, t4, m0],
      false,
      "Mae Daproph",
      "Tier 345",
      "more"
    )
  );
  card4.push(
    new courseSection(
      "PHIL 1300",
      "Critical Considering",
      "A03",
      [m6, t0, m6, t0, m6],
      false,
      "Mae Daproph",
      "Tier 234",
      "more"
    )
  );

  /////////////////only 2 of these next 3 work together, deliberately//////////////
  //Physics 1200
  const card5 = [
    new courseSection(
      "PHYS 1200",
      "Mechanics of Physics",
      "A01",
      [m1, t5, m1, t0, m1],
      false,
      "Pierre Chidi",
      "Armes 201",
      "more"
    )
  ];
  card5.push(
    new courseSection(
      "PHYS 1200",
      "Mechanics of Physics",
      "A02",
      [m3, t0, m3, t5, m3],
      false,
      "Pierre Chidi",
      "Armes 201",
      "more"
    )
  );

  //Math 1210
  const card6 = [
    new courseSection(
      "MATH 1210",
      "Linear Algebra",
      "A01",
      [m1, t2, m1, t0, m1],
      false,
      "Tiyae Smartypants",
      "Wallace 240",
      "more"
    )
  ];
  card6.push(
    new courseSection(
      "MATH 1210",
      "Linear Algebra",
      "A02",
      [m0, t3, m3, t3, m0],
      false,
      "Tiyae Smartypants",
      "Wallace 240",
      "more"
    )
  );

  //Statistics 1000
  const card7 = [
    new courseSection(
      "STAT 1000",
      "Probability in Something",
      "A01",
      [m3, t5, m3, t0, m3],
      false,
      "Pierre Chidi",
      "Armes 102",
      "more"
    )
  ];
  card7.push(
    new courseSection(
      "STAT 1000",
      "Probability in Something",
      "A02",
      [m0, t2, m0, t2 | t3, m0],
      false,
      "Professor Professorson",
      "Armes 102",
      "more"
    )
  );

  fullCourseList = [card1, card2, card3, card4, card5, card6, card7];
  return;
}

//globals

function clearTimetable() {
  document.getElementById("Mon").innerHTML = `<span class="name">Mon</span>`;
  document.getElementById("Tue").innerHTML = `<span class="name">Tue</span>`;
  document.getElementById("Wed").innerHTML = `<span class="name">Wed</span>`;
  document.getElementById("Thr").innerHTML = `<span class="name">Thu</span>`;
  document.getElementById("Fri").innerHTML = `<span class="name">Fri</span>`;
}

function makeDiv(slot) {
  var div1 = document.createElement("div");

  var name = document.createElement("div");
  name.setAttribute("class", "classNameText");
  name.innerHTML = slot.name;
  div1.appendChild(name);

  var section = document.createElement("div");
  section.setAttribute("class", "sectionText");
  section.innerHTML = slot.section;
  div1.appendChild(section);

  switch (slot.startTime) {
    case "0800":
      div1.className = "hour__08";
      break;
    case "0830":
      div1.className = "hour__083";
      break;
    case "0900":
      div1.className = "hour__09";
      break;
    case "0930":
      div1.className = "hour__093";
      break;
    case "1000":
      div1.className = "hour__10";
      break;
    case "1030":
      div1.className = "hour__103";
      break;
    case "1100":
      div1.className = "hour__11";
      break;
    case "1130":
      div1.className = "hour__113";
      break;
    case "1200":
      div1.className = "hour__12";
      break;
    case "1230":
      div1.className = "hour__123";
      break;
    case "1300":
      div1.className = "hour__13";
      break;
    case "1330":
      div1.className = "hour__133";
      break;
    case "1400":
      div1.className = "hour__14";
      break;
    case "1430":
      div1.className = "hour__143";
      break;
    case "1500":
      div1.className = "hour__15";
      break;
    case "1530":
      div1.className = "hour__153";
      break;
    case "1600":
      div1.className = "hour__16";
      break;
    case "1630":
      div1.className = "hour__163";
      break;
    case "1700":
      div1.className = "hour__17";
      break;
    case "1730":
      div1.className = "hour__173";
      break;
    case "1800":
      div1.className = "hour__18";
      break;
  }

  switch (slot.colour) {
    case "priority1":
      div1.className += " class1";
      break;
    case "priority2":
      div1.className += " class2";
      break;
    case "priority3":
      div1.className += " class3";
      break;
    case "priority4":
      div1.className += " class4";
      break;
    case "priority5":
      div1.className += " class5";
      break;
  }

  switch (slot.day) {
    case "Mon":
      div1.className += " hour_MWF";
      document.getElementById("Mon").appendChild(div1);
      break;
    case "Tue":
      div1.className += "  hour_TTR";
      document.getElementById("Tue").appendChild(div1);
      break;
    case "Wed":
      div1.className += "  hour_MWF";
      document.getElementById("Wed").appendChild(div1);
      break;
    case "Thr":
      div1.className += "  hour_TTR";
      document.getElementById("Thr").appendChild(div1);
      break;
    case "Fri":
      div1.className += " hour_MWF";
      document.getElementById("Fri").appendChild(div1);
      break;
  }
}

function nextSchedule() {
  if (schedNum == schedules.length - 1) return;
  schedNum++;
  console.log(schedNum);
  renderTimtable();
}

function prevSchedule() {
  if (schedNum == 0) return;
  schedNum--;
  console.log(schedNum);
  renderTimtable();
}

/*
  Takes a given binaryArray of a section's times, and (hopefully) returns a string
  to print in the card for it's times, in the format "MWF: 8:30-9:20 Tu: 10:00-11:15" 
*/
function getCardTime(binaryArray) {
  const dayChar = ["M", "Tu", "W", "Th", "F"];
  let theTime = "";
  var checker = 0b1000000;

  while (checker > 0b0) {
    //check MWF:
    for (day = 0; day < 3; day++) {
      //if time slot is filled
      if ((binaryArray[2 * day] & checker) > 0) {
        //add each day letter that applies
        if ((binaryArray[0] & checker) > 0) {
          theTime += dayChar[0];
        }
        if ((binaryArray[2] & checker) > 0) {
          theTime += dayChar[2];
        }
        if ((binaryArray[4] & checker) > 0) {
          theTime += dayChar[4];
        }

        //add time that applies
        switch (checker) {
          case 0b1000000:
            theTime += ": 8:30-9:20 ";
            break;
          case 0b0100000:
            theTime += ": 9:30-10:20 ";
            break;
          case 0b0010000:
            theTime += ": 10:30-11:20 ";
            break;
          case 0b0001000:
            theTime += ": 11:30-12:20 ";
            break;
          case 0b0000100:
            theTime += ": 12:30-1:20 ";
            break;
          case 0b0000010:
            theTime += ": 1:30-2:20 ";
            break;
          case 0b0000001:
            theTime += ": 2:30-3:20 ";
            break;
        }
        theTime += "<br/>";
        day = 4; //dont check other days if already found!
      } //if
    } //for each day
    checker = checker >> 1;
  } //while (all time slots)

  //Tu/Th days:
  checker = 0b10000;

  while (checker > 0b0) {
    //check MWF:
    for (day = 0; day < 2; day++) {
      //if time slot is filled
      if ((binaryArray[2 * day + 1] & checker) > 0) {
        //add each day letter that applies
        if ((binaryArray[1] & checker) > 0) {
          theTime += dayChar[1];
        }
        if ((binaryArray[3] & checker) > 0) {
          theTime += dayChar[3];
        }

        //add time that applies
        switch (checker) {
          case 0b10000:
            theTime += ": 8:30-9:45 ";
            break;
          case 0b01000:
            theTime += ": 10:00-11:15 ";
            break;
          case 0b00100:
            theTime += ": 11:30-12:45 ";
            break;
          case 0b00010:
            theTime += ": 1:00-2:15 ";
            break;
          case 0b00001:
            theTime += ": 2:30-3:45 ";
            break;
        }
        theTime += "<br/>";
        day = 4; //dont check other days if already found!
      } //if
    } //for each day
    checker = checker >> 1;
  } //while (all time slots)

  return theTime;
} //getCardTime

function renderToggle() {
  document.getElementById("toggleSched").innerHTML =
    `<span class="glyphicon glyphicon-chevron-left" id="prevSched"></span>` +
    (schedNum + 1) +
    ` of ` +
    schedules.length +
    ` 
  <span
    class="glyphicon glyphicon-chevron-right"
    id="nextSched"
  ></span>`;

  var next = document.getElementById("nextSched");
  next.addEventListener("click", nextSchedule);

  var prev = document.getElementById("prevSched");
  prev.addEventListener("click", prevSchedule);
}

function renderTimtable() {
  schedNum = schedules.length < schedNum + 1 ? 0 : schedNum;
  clearTimetable();
  renderToggle();
  schedules[schedNum].forEach(slot => {
    slotDiv = makeDiv(slot);
  });
}
