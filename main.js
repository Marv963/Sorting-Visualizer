// Preset //
const arraySlider = document.getElementById("ArrayRange");
const speedSlider = document.getElementById("SpeedRange");
const textBox = document.getElementById("Textbox");
var algorithm = "BubbleSort"; //default Start BubbleSort
var animation = false;
var stopAnimation = false;
var arr = [];
var speed = 16;
var max = 100; // max Value default 100;
fillTextBox(20); // default amount of bars
readTextBox(); // Start in the Beginng for Testing

// update on Window Resize //
window.onresize = function () {
  if (animation == false) {
    readTextBox();
  } else {
    stopAnimation = true;
  }
};

function algButton(value) {
  document.getElementById(algorithm).classList.remove("active");
  document.getElementById(value).classList.add("active");
  readTextBox();
  algorithm = value; //value== Algorithm like BubbleSort or QuickSort...
}

function startButton() {
  const button = document.getElementById("StartButton");
  stopAnimation = true;
  if (animation == false) {
    if (button.innerText == "Sort!") {
      button.innerText = "Stop";
      stopAnimation = false;
      switch (algorithm) {
        case "BubbleSort":
          bubbleSort();
          break;
        case "SelectionSort":
          selectionSort();
          break;
        case "QuickSort":
          quickSort(0, arr.length - 1);
          break;
        case "MergeSort":
          mergeSort(0, arr.length - 1);
          break;
        case "HeapSort":
          heapSort();
          break;
      }
      return;
    } else {
      readTextBox();
    }
  }
  button.innerText = "Sort!";
}

// fill the array with random numbers from 0 to value //
function fillTextBox(value) {
  arr = [];
  for (var i = 0; i < value; i++) {
    arr.push(Math.floor(Math.random() * max) + 1); // min==1 max==100
  }
  textBox.value = arr;
}

// change size of Array //
arraySlider.onchange = function () {
  stopAnimation = true;
  fillTextBox(arraySlider.value);
  readTextBox();
};

// Change speed of swapping //
speedSlider.oninput = function () {
  speed = Math.floor(80 / speedSlider.value);
};

function readTextBox() {
  stopAnimation = true;
  const button = document.getElementById("StartButton");
  button.innerText = "Sort!";
  textBox.value = textBox.value.replace(
    /[a-zA-Z`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/g,
    ""
  );
  arr = textBox.value.split(",");
  arr = arr.filter(Boolean);
  arr = arr.map((arr) => +arr); //Convert string array to a int array
  createBar();
}

function createBar() {
  removeBar("bar");
  removeBar("barValue");
  const length = arr.length;
  const maxValue = Math.max.apply(null, arr); // max value of arr
  const divObj = document.getElementById("div-bar"); // reference of div-bar
  const frameObj = document.getElementById("Frame"); // reference of frame
  const frameSize = frameObj.getBoundingClientRect(); // reference of frame size
  let fontSize;
  if (length < 5) fontSize = (frameSize.width / length) * 0.1 + "px";
  else if (length < 10) fontSize = (frameSize.width / length) * 0.28 + "px";
  else if (length < 60) fontSize = (frameSize.width / length) * 0.57 + "px";
  else fontSize = (frameSize.width / length) * 0.6 + "px";
  for (let i = 0; i < length; i++) {
    // Create for every index one bar.
    const bar = document.createElement("div");
    bar.setAttribute("id", i); // Assign id
    bar.classList.add("bar");
    divObj.appendChild(bar);

    // Create Value of every bar
    const barValue = document.createElement("V");
    barValue.setAttribute("id", "v" + i); // Assign id
    const barV = document.createTextNode(arr[i]);
    barValue.classList.add("barValue"); // classlist for top
    barValue.appendChild(barV);
    divObj.appendChild(barValue);
    barValue.style.fontSize = fontSize;

    //Css styles
    bar.style.width = (frameSize.width / length) * 0.6 + "px"; //Frame vw=96
    bar.style.margin = (frameSize.width / length / 2) * 0.4 + "px";
    bar.style.height = frameSize.height * 0.8 * (arr[i] / maxValue) + "px";

    // Top
    bar.style.top =
      frameSize.top -
      parseFloat(bar.style.margin) +
      frameSize.height -
      parseFloat(bar.style.height) +
      -1 +
      "px";

    //Left
    bar.style.left =
      frameSize.left +
      i * (parseFloat(bar.style.width) + 2 * parseFloat(bar.style.margin)) +
      "px"; //Distance between the bars
    barValue.style.left =
      parseFloat(bar.style.left) +
      parseFloat(bar.style.margin) +
      parseFloat(bar.style.width) / 2 -
      barValue.clientWidth / 2 +
      "px";
  }
}

// remove all child classes //
function removeBar(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

async function bubbleSort() {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - (i + 1); j++) {
      await showPos(j, j + 1);
      if (arr[j] > arr[j + 1]) {
        await swap(j, j + 1);
        swapIndex(j, j + 1);
      }
      if (stopAnimation == true) {
        readTextBox();
        return;
      }
    }
    inPos(arr.length - i - 1, 0);
  }
}

async function selectionSort() {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      inPos(j, 1);
      await showPos(i, min);
      inPos(j, 2);
      if (arr[j] < arr[min]) {
        min = j;
      }
      if (stopAnimation) {
        readTextBox();
        return;
      }
    }
    if (i != min) await swap(i, min);
    inPos(i, 0);
    swapIndex(i, min);
  }
}

async function partition(start, end) {
  let startIndex = start;
  let pivot = arr[end]; // pivot == (last) element in arr
  inPos(end, 3); //Waiting for positioning

  for (let i = start; i < end; i++) {
    if (stopAnimation) {
      readTextBox();
      return;
    }
    await showPos(i, startIndex);
    if (arr[i] < pivot) {
      await swap(i, startIndex);
      swapIndex(i, startIndex);
      startIndex++;
    }
  }
  await swap(startIndex, end);
  swapIndex(startIndex, end);
  inPos(startIndex, 0);
  return startIndex;
}

async function quickSort(start, end) {
  if (start > end) return;
  const pivot = await partition(start, end);
  // pivot is sorted on the right position
  if (stopAnimation) {
    readTextBox();
    return;
  }
  await Promise.all([quickSort(start, pivot - 1), quickSort(pivot + 1, end)]);
}

async function mergeArray(start, end) {
  let itmd = []; // for storing intermediate values
  const mid = Math.floor((start + end) / 2);
  let start1 = start,
    start2 = mid + 1;
  let end1 = mid,
    end2 = end;

  // Initial index of merged subarray
  let index = start;
  let swaphelper = [];

  while (start1 <= end1 && start2 <= end2) {
    if (arr[start1] <= arr[start2]) {
      swaphelper[index] = start1;
      itmd[index] = arr[start1];
      index++;
      start1++;
    } else if (arr[start1] > arr[start2]) {
      swaphelper[index] = start2;
      itmd[index] = arr[start2];
      index++;
      start2++;
    }
  }

  // Copy the remaining element of arr[], if there are any
  while (start1 <= end1) {
    swaphelper[index] = start1;
    itmd[index] = arr[start1];
    index++;
    start1++;
  }

  while (start2 <= end2) {
    swaphelper[index] = start2;
    itmd[index] = arr[start2];
    index++;
    start2++;
  }

  index = start;

  let endPos =
    index == 0 && end == arr.length - 1
      ? true // arr[x] is in end Position
      : false; // arr[x] isn't in end Position

  while (index <= end) {
    if (stopAnimation) {
      readTextBox();
      return;
    }

    // Only swap if arr[index] != current right position
    if (index != swaphelper[index]) {
      await swap(index, swaphelper[index]);

      // Change the swapped index to the new current index
      swaphelper[swaphelper.indexOf(index, index + 1)] = swaphelper[index];
    }

    if (endPos) inPos(index, 0);

    arr[index] = itmd[index];
    index++;
  }
}

async function mergeSort(start, end) {
  if (start < end) {
    const mid = Math.floor((start + end) / 2);

    if (stopAnimation) {
      readTextBox();
      return;
    }
    await Promise.all([mergeSort(start, mid), mergeSort(mid + 1, end)]);

    if (stopAnimation) {
      readTextBox();
      return;
    }

    await Promise.all([mergeArray(start, end)]);
  }
}

async function max_heapify(i, length) {
  while (true) {
    let left = i * 2 + 1;
    let right = i * 2 + 2;
    let largest = i;

    if (left < length && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < length && arr[right] > arr[largest]) {
      largest = right;
    }

    if (i == largest) {
      break;
    }
    if (stopAnimation) {
      readTextBox();
      return;
    }
    await swap(i, largest);
    swapIndex(i, largest);
    i = largest;
  }
}

async function heapify(length) {
  for (let i = Math.floor(length / 2); i >= 0; i--) {
    if (stopAnimation) {
      readTextBox();
      return;
    }
    await max_heapify(i, length);
  }
}

async function heapSort() {
  await heapify(arr.length);

  for (let i = arr.length - 1; i > 0; i--) {
    if (stopAnimation) {
      readTextBox();
      return;
    }
    await swap(i, 0);
    inPos(i, 0);
    swapIndex(i, 0);

    if (stopAnimation) {
      readTextBox();
      return;
    }
    await max_heapify(0, i);
  }
  inPos(0, 0);
}

// swap index i with j //
function swapIndex(i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

// swapanimation i with j //
async function swap(i, j) {
  if (i == j) return;
  await showPos(i, j);
  const bar1 = document.getElementById(i); //get reference of frame
  const bar2 = document.getElementById(j);
  bar1.style.zIndex = "1";
  bar2.style.zIndex = "1";
  bar1.style.backgroundColor = "#0074D9";
  bar2.style.backgroundColor = "#0074D9";

  const bar1Val = document.getElementById("v" + i);
  const bar2Val = document.getElementById("v" + j);
  bar1Val.style.zIndex = "1";
  bar2Val.style.zIndex = "1";
  bar1Val.style.color = "#0074D9";
  bar2Val.style.color = "#0074D9";

  const temp1 = parseFloat(bar1.style.left);
  const temp2 = parseFloat(bar2.style.left);
  const x1 = (temp2 - temp1) / speed;
  let temp3 = parseFloat(bar1Val.style.left);
  const temp4 =
    parseFloat(bar2.style.left) +
    parseFloat(bar2.style.margin) +
    parseFloat(bar2.style.width) / 2 -
    bar1Val.clientWidth / 2;
  const x2 = (temp4 - temp3) / speed;
  temp3 =
    parseFloat(bar1.style.left) +
    parseFloat(bar1.style.margin) +
    parseFloat(bar1.style.width) / 2 -
    bar2Val.clientWidth / 2;

  const animate = new Promise((resolve, reject) => {
    const timer = setInterval(function () {
      if (stopAnimation == true) {
        clearInterval(timer);
        reject("Animation stopped!");
        return;
      } else if (
        (x1 > 0 && temp1 >= parseFloat(bar2.style.left) - x1) ||
        (x1 < 0 && temp1 <= parseFloat(bar2.style.left) + x1)
      ) {
        bar1.style.left = temp2 + "px";
        bar2.style.left = temp1 + "px";
        bar1Val.style.left = temp4 + "px";
        bar2Val.style.left = temp3 + "px";
        clearInterval(timer);
        resolve("animation is resolved");
        return;
      }
      bar1.style.left = parseFloat(bar1.style.left) + x1 + "px";
      bar2.style.left = parseFloat(bar2.style.left) - x1 + "px";
      bar1Val.style.left = parseFloat(bar1Val.style.left) + x2 + "px";
      bar2Val.style.left = parseFloat(bar2Val.style.left) - x2 + "px";
    }, 1);
  });
  animation = true;
  const result = await animate

    .then((value) => {
      //animation is resolved
      bar1.setAttribute("id", j); //change old id
      bar2.setAttribute("id", i); //change old id
      bar1Val.setAttribute("id", "v" + j);
      bar2Val.setAttribute("id", "v" + i);
      bar1.style.background = "#7FDBFF";
      bar2.style.background = "#7FDBFF";
      bar1Val.style.color = "#7FDBFF";
      bar2Val.style.color = "#7FDBFF";
      bar1.style.zIndex = "0";
      bar2.style.zIndex = "0";
      bar1Val.style.zIndex = "0";
      bar2Val.style.zIndex = "0";
      animation = false;
    })
    .catch((error) => {
      console.log(error);
      animation = false;
    });
  if (!stopAnimation) await showPos(i, j);
}

// Show current possition //
function inPos(index, state) {
  let c;
  switch (state) {
    case 0: // == in end position dark blue
      c = "#001f3f";
      break;
    case 1: // == current search position green
      c = "#39CCCC";
      break;
    case 2: // == stop current search pos default bright blue
      c = "#7FDBFF";
      break;
    case 3: // == Waiting
      c = "#B10DC9";
      break;
  }
  const bar = document.getElementById(index);
  const barVal = document.getElementById("v" + index);
  bar.style.backgroundColor = c;
  barVal.style.color = c;
}

// Show position for a little moment //
async function showPos(i, j) {
  animation = true;
  const bar1 = document.getElementById(i);
  const bar2 = document.getElementById(j);
  bar1.style.backgroundColor = "#0074D9";
  bar2.style.backgroundColor = "#0074D9";
  const ms = Math.floor(speed * 0.8);
  let counter = 0;

  const bar1Val = document.getElementById("v" + i);
  const bar2Val = document.getElementById("v" + j);
  bar1Val.style.color = "#0074D9";
  bar2Val.style.color = "#0074D9";

  const waitAMoment = new Promise((resolve, reject) => {
    var timer = setInterval(function () {
      if (stopAnimation == true) {
        clearInterval(timer);
        reject("Animation stopped!");
      } else if (counter == ms) {
        clearInterval(timer);
        resolve("wait finished");
      }
      counter++;
    }, 1);
  });
  const res = await waitAMoment
    .then((value) => {
      bar1.style.backgroundColor = "#7FDBFF";
      bar2.style.backgroundColor = "#7FDBFF";
      bar1Val.style.color = "#7FDBFF";
      bar2Val.style.color = "#7FDBFF";
      animation = false;
    })
    .catch((error) => {
      animation = false;
      console.log(error);
    });
}
