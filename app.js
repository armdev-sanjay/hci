
//______________________________________________________________________________________________________________________
//SANJAY JS
//______________________________________________________________________________________________________________________




// Drag Events
function dragStart(e) {
  dragSrcEl = this;
  this.className += ' course-hold'; 
  setTimeout(()=> this.className = ' course-invisible', 0); 
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
};

function dragEnter(e) {
  this.classList.add('over');
}

function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove('over');
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function dragDrop(e) {
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return false;
}

function dragEnd(e) {
  var listItens = document.querySelectorAll('.course');
  [].forEach.call(listItens, function(item) {
    item.classList.remove('over');
  });
  this.style.opacity = '1';
}

function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}



// Add Listeners to Course Cards
var listItens = document.querySelectorAll('.course');
[].forEach.call(listItens, function(item) {
  addEventsDragAndDrop(item);
  item.addEventListener('mouseover', mouseOverCourse); 
  item.addEventListener('mouseout', mouseOutCourse); 
});



//Mouse Over and Out for course careds
function mouseOverCourse(){
  this.className+=" course-hover";
}

function mouseOutCourse(){
  this.className ="course";
}


// Add new Course

const adder = document.querySelector('.add'); 
adder.addEventListener('click', addNewCourse); 

function addNewCourse(){  
  var newItem = document.querySelector('.input').value;

  if (newItem != '') {
    document.querySelector('.input').value = '';
    var li = document.createElement('li');
    var attr = document.createAttribute('draggable');
    var ul = document.querySelector('ul');
    li.className = 'course';
    attr.value = 'true';
    li.setAttributeNode(attr);
    li.appendChild(document.createTextNode(newItem));
    ul.appendChild(li);
    addEventsDragAndDrop(li);
  }  
}




//______________________________________________________________________________________________________________________
//SKYLAR JS
//______________________________________________________________________________________________________________________




//______________________________________________________________________________________________________________________
//YUNI JS
//______________________________________________________________________________________________________________________
