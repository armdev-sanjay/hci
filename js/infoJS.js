function minimizeInfo() {
  var info = document.getElementById("info-card");
  info.classList.toggle("hide");
  var openInfo = document.getElementById("open-info-card");
  openInfo.classList.toggle("hide");
}

var minBtn = document.getElementById("minimize");
minBtn.addEventListener("click", minimizeInfo);

var openInfo = document.getElementById("open-info-card");
openInfo.addEventListener("click", minimizeInfo);
