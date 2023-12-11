var style = document.createElement('style');

const titleAnimTime = 2000;
const titleAnimSettleTime = 150;

var createdAnimations = []; // Memoization so that the program doesnt try to make two of the same animation classes
var correctCup = 0; // Default just so game doesnt break

const selectTime = [750, 500, 300]; // Time options I can barely do 300 ms
var time = selectTime[0];

const selectCup = [5, 7]; // Cup number options
var cupNum = selectCup[0]; // Default number of cups

const selectLength = [6, 8, 10]; // Length of shuffle options
var shuffleLength = selectLength[0]; // Default length of shuffle

const shuffleNum = 6; // Number of available shuffles, default for 5 cups

var playingGame = false; // Default

$(document).ready(function () {
  // Update everything 
  updateCorrectCup();
  updateModButtonValues();
  showCorrectCup();
  toggleExCups();

  // Start button logic
  $('#start-button').click(function () {
    // TODO: Make an effect for starting the game 
    hideElementsBeforeGame();
    deleteTitleAndRetype(titleAnimTime, titleAnimSettleTime, "Focus");
    playingGame = true;

    window.setTimeout(function() {
        window.setTimeout(function() {deleteTitleAndRetype((shuffleLength * time) / 2, 0, "")}, (shuffleLength * time) / 2);
        hideCorrectCup();
        switch(cupNum) {
            case 5:
            shuffle5_linearTime(shuffleLength, time);
            break;
            case 7:
            shuffle7_linearTime(shuffleLength, time);
            break;
        } 
    }, titleAnimTime + titleAnimSettleTime);

    window.setTimeout(function() {
        playingGame = false;
        deleteTitleAndRetype(titleAnimTime, 0, "Choose");
    }, ((shuffleLength - 1) * time) + titleAnimTime);
  });

  // Clicking Cup Logic
  for (let i=0; i < selectCup[selectCup.length - 1]; i++) {
    $(`#cup-${i}`).click(function () {
        // If the start game button isn't hidden then no cup logic is needed
        if (!$('#start-button').is(':hidden') && playingGame) return;
        showCorrectCup();
        if (i === correctCup) {
            // TODO: Add respective effects for both
            // alert("YEH")
            deleteTitleAndRetype(titleAnimTime / 2, titleAnimSettleTime, "Correct");
        } else {
            deleteTitleAndRetype(titleAnimTime / 2, titleAnimSettleTime, "WRONG");
        }
        window.setTimeout(function() {
            deleteTitleAndRetype(titleAnimTime / 2, titleAnimSettleTime, "Cup Game");
            showElementsAfterGame();
            updateCorrectCup();
            showCorrectCup();
        }, (titleAnimTime / 2) + (titleAnimSettleTime * 2));
    });
  }

  // Show and hide mod menu logics
  $('#show-mods-button').click(function() {
    showModMenu();
  });
  $('#hide-mods-button').click(function() {
    hideModMenu();
  });

  // Mod selection logic
  $('#cup-select-button').click(function() {
    let currentIndex = selectCup.indexOf(cupNum);
    if (currentIndex + 1 === selectCup.length) {
      cupNum = selectCup[0];
    } else {
      cupNum = selectCup[currentIndex + 1];
    }
    updateModButtonValues();
    updateCorrectCup();
    showCorrectCup();
    toggleExCups();
  });
  $('#time-select-button').click(function() {
    let currentIndex = selectTime.indexOf(time);
    if (currentIndex + 1 === selectTime.length) {
      time = selectTime[0];
    } else {
      time = selectTime[currentIndex + 1];
    }
    updateModButtonValues();
  });
  $('#length-select-button').click(function() {
    let currentIndex = selectLength.indexOf(shuffleLength);
    if (currentIndex + 1 === selectLength.length) {
      shuffleLength = selectLength[0];
    } else {
      shuffleLength = selectLength[currentIndex + 1];
    }
    updateModButtonValues();
  });
});

// All game logic, showing hiding buttons / updating elements

// Show the elements after gameplay
function showElementsAfterGame() {
  $('#start-button').show();
  $('#show-mods-button').show();
}

// Hide all elements that block gameplay before play
function hideElementsBeforeGame() {
  $('#start-button').hide();
  $('#show-mods-button').hide();
}

// Shows the mod menu
function showModMenu() {
  let modsContainer = document.getElementById('mods-container');
  modsContainer.classList.remove('hide-mods');
  void modsContainer.offsetWidth;
  modsContainer.classList.add('show-mods');
  $('#start-button').attr('disabled', 'true');
}

// Hides the mod menu
function hideModMenu() {
  let modsContainer = document.getElementById('mods-container');  
  modsContainer.classList.remove('show-mods');
  void modsContainer.offsetWidth;
  modsContainer.classList.add('hide-mods');
  $('#start-button').removeAttr('disabled')
}

// Shows correct cup
function showCorrectCup() {
    hideCorrectCup(); // Gets rid of old correct cup in the case that it changes 
    $(`#cup-${correctCup}`).attr('src', 'img/cupball.png');
}

// Changes all the cups back to default texture before game
function hideCorrectCup() {
    for (let i=0; i < cupNum; i++) {
        $(`#cup-${i}`).attr('src', 'img/cup.png');
    }
}

// Toggle extra cups, compatible with future larger cup numbers
function toggleExCups() {
    // $('#test').text(`0->${cupNum - 1}, ${cupNum}->${selectCup[selectCup.length - 1] - 1}`);
    for (let i=0; i<cupNum; i++) {
        let cup = document.getElementById(`cup-${i}`);
        // Clear prior animations 
        cup.className = '';
        cup.style.animation = ''; 
        $(`#cup-${i}`).css('display', 'block');
    }
    for(let i=cupNum; i < selectCup[selectCup.length - 1]; i++) {
        $(`#cup-${i}`).css('display', 'none');
    }
}

// Change the correct cup after a round of the game
function updateCorrectCup() {
  correctCup = Math.floor(Math.random() * cupNum);
}

// Update values on the mod buttons
function updateModButtonValues() {
  $('#cup-select-button').text(`Cups: ${cupNum} cups`);
  $('#time-select-button').text(`Time between steps: ${time} ms`);
  $('#length-select-button').text(`Length of shuffle: ${shuffleLength} steps`);
}


function deleteTitleAndRetype(time, settleTime, newText) {
    let title = document.getElementById('title');
    let text = title.innerHTML;
    const first_typingSpeed = (time) / 2 / text.length;
    const second_typingSpeed = (time) / 2 / newText.length;

    // Delete old text
    for (let i=text.length; i >= 0; i--) {
        setTimeout(function() {title.innerHTML = text.substring(0, i);}, (text.length - i) * first_typingSpeed);
    }

    // Type new text
    window.setTimeout(function() {
        for (let i=0; i < newText.length; i++) {
            setTimeout(function() {title.innerHTML += newText.charAt(i);}, (i * second_typingSpeed));
        }
    }, (time / 2) + settleTime);
    // Failsafe incase it gets intuerrupted hopefully it does settlet at "Cup Game"
    window.setTimeout(function() {
        title.innerHTML = newText;
    }, time + settleTime + 20);
}

/**
 *  Cup Animations
 */

// Moves the cup x units to the right, negative makes it move left
// and upDir up if pos down if neg, zero locks y axis movement
// time in ms for how long the animation lasts
function moveCup(cupId, upDir, rightUnit, time) {
  let cup = document.getElementById(cupId);
  // Clear prior animations 
  cup.className = '';
  cup.style.animation = ''; 

  let className = `up${upDir}-right${rightUnit}-time${time}`

  // Memoization for less computation
  if (createdAnimations.includes(className)) {
    void cup.offsetWidth; // Weird chatgpt hack that reflows the animation
    cup.className = className;
    return;
  } 

  // Locks the upDir to only move up one whole cupwidth
  upDir = Math.min(Math.max(upDir, -1), 1);

  let dx = document.getElementById('cup-0').clientWidth * rightUnit;
  let dy = -1 * document.getElementById('cup-0').clientHeight * upDir; // * -1 because pos is down for html

//   document.getElementById('test').innerHTML = `dy ${dy}, dx ${dx}`;
  
  style.innerText += `.${className} {position:relative; animation-name:move-${className}; animation-duration:${time}ms}`;
  style.innerText += `@keyframes move-${className} {0% {transform:translate(0px,0px);} 33%{transform:translate(0px,${dy}px);} 66%{transform:translate(${dx}px, ${dy}px);} 100%{transform:translate(${dx}px, 0px);}}`
  document.getElementsByTagName('head')[0].appendChild(style);

  createdAnimations.push(className); // Add class name to list of created animations
  cup.className = className;
}

// Basic shuffle for 5 cups linear time meaning time is constant
function shuffle5_linearTime(length, time) {
  for (let i=0; i < length; i++) {
    switch(Math.floor(Math.random() * (shuffleNum))) {
      case 0:
        window.setTimeout(function() {cut5_L(time)}, i * time);
        break;
      case 1:
        window.setTimeout(function() {cut5_R(time)}, i * time);
        break;
      case 2:
        window.setTimeout(function() {tunnel5_L(time)}, i * time);
        break;
      case 3:
        window.setTimeout(function() {tunnel5_R(time)}, i * time);
        break;
      case 4:
        window.setTimeout(function() {funky5_1(time)}, i * time);
        break;
      case 5:
        window.setTimeout(function() {funky5_2(time)}, i * time);
        break;
    }
  } 
}

function shuffle7_linearTime(length, time) {
  for (let i=0; i < length; i++) {
    switch(Math.floor(Math.random() * (shuffleNum))) {
      case 0:
        window.setTimeout(function() {cut7(time)}, i * time);
        break;
      case 1:
        window.setTimeout(function() {shift7_L(time)}, i * time);
        break;
      case 2:
        window.setTimeout(function() {shift7_R(time)}, i * time);
        break;
      case 3:
        window.setTimeout(function() {halfCutTunn7_L(time)}, i * time);
        break;
      case 4:
        window.setTimeout(function() {halfCutTunn7_R(time)}, i * time);
        break;
      case 5:
        window.setTimeout(function() {funky7(time)}, i * time);
        break;
    }
  } 
}

// Steps for 5 cups

// Cuts the 4 left cups ignore the last cup
function cut5_L(time) {
  moveCup('cup-0', -1, 1, time);
  moveCup('cup-1', 1, -1, time);
  moveCup('cup-2', -1, 1, time);
  moveCup('cup-3', 1, -1, time);
  let correctCupArr = [1, 0, 3, 2, 4];
  correctCup = correctCupArr[correctCup];
}
// Cuts the 4 right cups ignoring the first cup
function cut5_R(time) {
  moveCup('cup-1', -1, 1, time);
  moveCup('cup-2', 1, -1, time);
  moveCup('cup-3', -1, 1, time);
  moveCup('cup-4', 1, -1, time);
  let correctCupArr = [0, 2, 1, 4, 3];
  correctCup = correctCupArr[correctCup];
}
// Tunnels the far right cup to the far left
function tunnel5_L(time) {
  moveCup('cup-0', -1, 1, time);
  moveCup('cup-1', 1, 1, time);
  moveCup('cup-2', -1, 1, time);
  moveCup('cup-3', 1, 1, time);
  moveCup('cup-4', 0, -4, time);
  let correctCupArr = [1, 2, 3, 4, 0];
  correctCup = correctCupArr[correctCup];
}
// Tunnels the far left cup to the far right
function tunnel5_R(time) {
  moveCup('cup-0', 0, 4, time);
  moveCup('cup-1', -1, -1, time);
  moveCup('cup-2', 1, -1, time);
  moveCup('cup-3', -1, -1, time);
  moveCup('cup-4', 1, -1, time);
  let correctCupArr = [4, 0, 1, 2, 3];
  correctCup = correctCupArr[correctCup];
}
// Funky looking scramble step
function funky5_1(time) {
  moveCup('cup-0', 1, 2, time);
  moveCup('cup-1', -1, -1, time);
  moveCup('cup-2', 0, -1, time);
  moveCup('cup-3', -1, 1, time);
  moveCup('cup-4', 1, -1, time);
  let correctCupArr = [2, 0, 1, 4, 3];
  correctCup = correctCupArr[correctCup];
}
// Funky 1 step but mirrored
function funky5_2(time) {
  moveCup('cup-0', -1, 1, time);
  moveCup('cup-1', 1, -1, time);
  moveCup('cup-2', 0, 1, time);
  moveCup('cup-3', -1, 1, time);
  moveCup('cup-4', 1, -2, time);
  let correctCupArr = [1, 0, 3, 4, 2]
  correctCup = correctCupArr[correctCup];
}

// Steps for 7 cups

// Cuts all left side cups to the right and vice versa
function cut7(time) {
  moveCup('cup-0', -1, 4, time);
  moveCup('cup-1', -1, 4, time);
  moveCup('cup-2', -1, 4, time);
  moveCup('cup-4', 1, -4, time);
  moveCup('cup-5', 1, -4, time);
  moveCup('cup-6', 1, -4, time);
  let correctCupArr = [4, 5, 6, 3, 0, 1, 2];
  correctCup = correctCupArr[correctCup];
} 

// Shifts all the odd cups to the right one, with exception to the last cup
function shift7_R(time) {
  moveCup('cup-0', -1, 2, time);
  moveCup('cup-1', 0, 0, time);
  moveCup('cup-2', -1, 2, time);
  moveCup('cup-3', 0, 0, time);
  moveCup('cup-4', -1, 2, time);
  moveCup('cup-5', 0, 0, time);
  moveCup('cup-6', 1, -6, time);
  let correctCupArr = [2, 1, 4, 3, 6, 5, 0];
  correctCup = correctCupArr[correctCup];
}

// Shifts all the odd cups to the left one, with exception to the last cup
function shift7_L(time) {
  moveCup('cup-0', -1, 6, time);
  moveCup('cup-1', 0, 0, time);
  moveCup('cup-2', 1, -2, time);
  moveCup('cup-3', 0, 0, time);
  moveCup('cup-4', 1, -2, time);
  moveCup('cup-5', 0, 0, time);
  moveCup('cup-6', 1, -2, time);
  let correctCupArr = [6, 1, 0, 3, 2, 5, 4];
  correctCup = correctCupArr[correctCup];
}

// Does a cut on the left and tunnels on the right
function halfCutTunn7_L(time) {
  moveCup('cup-0', -1, 2, time);
  moveCup('cup-1', 0, -1, time);
  moveCup('cup-2', 1, -1, time);
  moveCup('cup-3', 0, 3, time);
  moveCup('cup-4', 1, -1, time);
  moveCup('cup-5', 1, -1, time);
  moveCup('cup-6', 1, -1, time);
  let correctCupArr = [2, 0, 1, 6, 3, 4, 5];
  correctCup = correctCupArr[correctCup];
}

// Does a cut on the right and tunnels on the left
function halfCutTunn7_R(time) {
  moveCup('cup-0', 1, 1, time);
  moveCup('cup-1', 1, 1, time);
  moveCup('cup-2', 1, 1, time);
  moveCup('cup-3', 0, -3, time);
  moveCup('cup-4', -1, 2, time);
  moveCup('cup-5', 0, -1, time);
  moveCup('cup-6', 1, -1, time);
  let correctCupArr = [1, 2, 3, 0, 6, 4, 5];
  correctCup = correctCupArr[correctCup];
}

// Does a cut on the right and tunnels on the left
function funky7(time) {
  moveCup('cup-0', -1, 2, time);
  moveCup('cup-1', 0, -1, time);
  moveCup('cup-2', 1, 1, time);
  moveCup('cup-3', 0, -2, time);
  moveCup('cup-4', 1, 2, time);
  moveCup('cup-5', -1, -1, time);
  moveCup('cup-6', -1, -1, time);
  let correctCupArr = [2, 0, 3, 1, 6, 4, 5];
  correctCup = correctCupArr[correctCup];
}