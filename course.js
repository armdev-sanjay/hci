const math1510 = {
  A01: {
    name: "",
    instructor: "",
    times: [],
    location: ""
  },
  A02: {
    name: "",
    instructor: "",
    times: [],
    location: ""
  },
  B01: {
    name: "",
    instructor: "",
    times: [],
    location: ""
  }
};

const card2 = {
  A01: {
    section: "A01",
    name: "Copmuter Science Into",
    code: "COMP 1020",
    instructor: "",
    times: { M: 000100000, W: 000100000, F: 000100000 },
    location: ""
  },
  A02: {
    name: "",
    instructor: "",
    times: [],
    location: ""
  },
  B01: {
    name: "",
    instructor: "",
    times: [],
    location: ""
  }
};

const coursesAll = { math1510, comp1020 };

var userPriority = [comp1020, math1510, comp1020_1];

priority.forEach(card => {
  card.forEach(section => {
    if (checkConflict(section.times)) {
    } else {
    }
  });
});

var scheduledCourses = [[100110][100110][100110][100110][100110]];

checkConflict = times => {
  return T / F;
};
