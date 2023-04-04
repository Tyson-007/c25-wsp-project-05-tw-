let testArr = [
  {
    age: "29",
    gender: "M",
    weight: "120",
  },
  {
    age: "43",
    gender: "F",
    weight: "80",
  },
  {
    age: "25",
    gender: "F",
    weight: "110",
  },
];

console.log("testArr");
console.log(testArr);

console.log("---------");

for (test of testArr) {
  console.log("here are the rows");
  console.log(test);
}

for (test of testArr) {
  for (key in test) {
    console.log(key + ": " + test[key]);
  }
}
