
//! HSL COLORS!

window.onload = check;
function check() {
    document.getElementById("level1").checked = true;
}

// window.onload = checkAi;
// function checkAi() {
//     document.getElementById("AIvsAI").checked = false
// }

let gameHistory = []

console.log('version 1.9a by Niaugi')

let stepWasRandom = false
let winAIColor = '#F005'
let winPlayerColor = '#0F05'
let drawColor = '#AA05'
let AI_mode_only = false //! AI MODE
let gameOver = false
let playingRandomLevel = false
let currentPlayer = String
let oponentPlayer = String
let firstMove = Boolean
let aiFirst = false  //! change to TRUE if AI has to start 1st
const Player_X = 'X'
const Player_O = 'O'
let arr = []
let comparsion = []
let emptyCells = []
let level = 1
let pointsAI = 0
let pointsPlayer = 0
const winArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]
const kampai = [0, 2, 6, 8]

start()

function AIvsAI() {
    let AIMode = document.querySelector('#AIvsAI')
    console.log('AIMode checked status: ' + AIMode.checked)
    if (AIMode.checked == true) AI_mode_only = true
    else AI_mode_only = false
    console.log({ AI_mode_only })
    start()
}

function radio() { //! filtering LEVEL from radio buttons
    let radioStatus = document.getElementsByName('level')
    radioStatus.forEach(el => {
        if (el.checked == true) level = el.id[5]
        playingRandomLevel = false
    })
    console.log('Radio turned level: ' + level)
    if (level == 'r') {
        playingRandomLevel = true
        level = randomLevel()
    }
}

//! NEW FUNCTION -------------------***********************-----------
function randomLevel() {
    let levelsArray = [0, 1, 2]
    let rndLevel = Math.floor(Math.random() * levelsArray.length)
    return rndLevel
}

function start() {

    if (playingRandomLevel) {
        level = randomLevel()
        console.warn('got random level: ' + level)
    }
    console.warn('level is: ' + level)

    //! removing reset listener for AREA ---------------------------
    let area = document.querySelectorAll('.target')
    area.forEach(el => {
        el.removeEventListener('click', start)
        el.style.backgroundColor = 'transparent'
    })
    //* erase & reset AREA FIELDS & RESULT --------------------------
    area.forEach(el => el.innerText = '')
    if (!AI_mode_only) area.forEach(el => el.addEventListener('click', playerFlip))
    document.querySelector('.result').innerText = ''

    //* init Arrays
    arr = []
    comparsion = []

    gameOver = false
    firstMove = true

    //! NEW for AI --------------******************-------------------
    if (AI_mode_only) {

        // level = 2 //! AI LEVEL 2 !!!!!!!!!!!!!!!!!!!!!!!
        whoStartsAI()
        // for (let i = 0; i < 10; i++) {
        // gameOver = false

        while (!gameOver) {
            // console.warn('AI vs AI playing level ' + level)

            aiMove()
            reverseAI()

            if (!gameOver) {
                aiMove()
                reverseAI()
            } else {
                console.error('break from WHILE')
            }
        }

        // }

        function reverseAI() {
            if (currentPlayer == Player_X) {
                currentPlayer = Player_O
                oponentPlayer = Player_X
            } else {
                currentPlayer = Player_X
                oponentPlayer = Player_O
            }
        }

        function whoStartsAI() {
            if (aiFirst) {
                currentPlayer = Player_X
                oponentPlayer = Player_O
            } else {
                currentPlayer = Player_O
                oponentPlayer = Player_X
            }
        }
    }

    //? who starts first logic
    else if (aiFirst) {  //! aiFirst after WIN/DRAW will be INVERTED
        currentPlayer = Player_O
        oponentPlayer = Player_X
        firstMove = true
        aiMove()
    }
    else {
        currentPlayer = Player_X
        oponentPlayer = Player_O
        firstMove = false
    }
}

//* EventListener from player press goes HERE:
function playerFlip(el) {

    currentPlayer = Player_X
    oponentPlayer = Player_O
    playerMove()
    currentPlayer = Player_O
    oponentPlayer = Player_X
    if (!gameOver) aiMove()

    console.log('----------------------------')
    function playerMove() {
        let square = document.getElementById(el.target.id)
        if (square.innerText == '') {
            square.removeEventListener('click', playerFlip)
            square.innerText = currentPlayer
            makeArray()
            makeEmptyCells()
            winCheck()
        } else {
            console.error('field already occupied') //! this line should never be reached :)
        }
    }
}

function aiMove() {
    // console.log('AI playing level: ' + level)
    makeArray() //! returns arr[] of occupied fields
    makeEmptyCells()
    let target = ''

    //* prevencinis random target
    let rndEmptyIndex = Math.floor(Math.random() * emptyCells.length)
    target = '#a' + emptyCells[rndEmptyIndex]
    stepWasRandom = true

    //! START AI

    //! if nothing be true, instant paint target with RND target
    //* FIRST MOVE ONLY KAMPAI ------------- 1st MOVE (CORNER) ------------------
    if (firstMove && level == 2) { //! LEVEL 2 ONLY
        let firstMoveTargets = []
        emptyCells.forEach(el => {
            if (kampai.includes(el)) {
                firstMoveTargets.push(el)
            }
        })
        target = firstMoveTargets[Math.floor(Math.random() * firstMoveTargets.length)]
        firstMove = false
        target = '#a' + target
        stepWasRandom = false
        console.log('AI CORNERS')
    }

    //* CENTER ------------- 2nd MOVE (CENTER) ------------------

    else if (emptyCells.includes(4) && (!firstMove) && (level == 2)) { //! LEVEL 2 only
        target = '#a4'
        firstMove = false
        stepWasRandom = false
        console.log('AI CENTER')
    }
    //* ------------------------ 3rd 4th move -------------------------------
    //! Will be reached if ANY of above gave target
    else {
        console.log('AI LOGIC 3rd')
        firstMove = false
        //! AI LOGIC starts here
        let winArrayVariants = winArray.length

        //* FINAL WINNING COMBINATION (3rd)
        if (level > 0) { //! LEVEL 1 & 2
            console.log('level 1 & 2 - checking if player has winning positions')
            // thirdMove(Player_X) //! check if oponent has winning combo and block it
            thirdMove(oponentPlayer) //! target will be overwritten if AI can win with this move
            // thirdMove(Player_O) //! target will be overwritten if AI can win with this move
            thirdMove(currentPlayer) //! check if oponent has winning combo and block it
        }

        function thirdMove(player) {
            // console.warn('esame thirdMove funkc - player is: ' + player)
            // currentPlayer = player
            for (let i = 0; i < winArrayVariants; i++) {
                //* checking 0&1 xxo
                // if ((arr[winArray[i][0]] == currentPlayer) && (arr[winArray[i][1]] == currentPlayer)) {
                if ((arr[winArray[i][0]] == player) && (arr[winArray[i][1]] == player)) {
                    if (emptyCells.includes(winArray[i][2])) {
                        target = '#a' + winArray[i][2]
                        stepWasRandom = false
                    }
                }
                //* checking 1&2 oxx
                // else if ((arr[winArray[i][1]] == currentPlayer) && (arr[winArray[i][2]] == currentPlayer)) {
                else if ((arr[winArray[i][1]] == player) && (arr[winArray[i][2]] == player)) {
                    if (emptyCells.includes(winArray[i][0])) {
                        target = '#a' + winArray[i][0]
                        stepWasRandom = false
                    }
                }
                //* checking 0&2 xox
                // else if ((arr[winArray[i][0]] == currentPlayer) && (arr[winArray[i][2]] == currentPlayer)) {
                else if ((arr[winArray[i][0]] == player) && (arr[winArray[i][2]] == player)) {
                    if (emptyCells.includes(winArray[i][1])) {
                        target = '#a' + winArray[i][1]
                        stepWasRandom = false
                    }
                }
            }
        }
    }

    if (target === '') console.error('TARGET FOR AI IS EMPTY!') //should never be processed


    //! disabling radio buttons if AI made a move
    document.getElementsByName('level').forEach(el => el.disabled = true)
    console.log('AI painting target')

    //todo EXPERIMENTAL WAIT
    // setTimeout(() => {
    //     paintTarget()
    // }, 100);

    paintTarget() //! PAINT TARGET and remove event listener

    makeArray()
    makeEmptyCells()
    winCheck()

    //! paint target & remove event listener
    function paintTarget() {
        console.log({ target })
        if (AI_mode_only) {
            document.querySelector(target).innerHTML = currentPlayer
            if (stepWasRandom) gameHistory.push(target + ' ' + currentPlayer + ' ' + 'random')
            else gameHistory.push(target + ' ' + currentPlayer)
            console.warn('step was random: ' + stepWasRandom)
        }
        else {
            document.querySelector(target).innerText = Player_O
            document.querySelector(target).removeEventListener('click', playerFlip)
            console.warn('step was random: ' + stepWasRandom)
        }
    }
}

//* ARRAY of fields with X & O
function makeArray() {
    arr = []
    document.querySelectorAll('.target').forEach(el => arr.push(el.innerText))
}

//* ARRAY of EMPTY fields
function makeEmptyCells() {
    emptyCells = []
    arr.forEach((arrayEl, index) => {
        if (arrayEl == '') emptyCells.push(index)
    })
}

function winCheck() {
    for (let winArrayNo = 0; winArrayNo < winArray.length; winArrayNo++) {
        for (let el of winArray[winArrayNo]) {
            comparsion.push(arr[el])
        }

        if (comparsion.every(el => el == currentPlayer)) {
            //todo UZBRAUKIT LAIMETUS LAUKELIUS

            gameOver = true
            aiFirst = !aiFirst //! reversing who starts 1st

            //* COLOR OF WON FIELDS
            let winColor = ''
            let wonFields = winArray[winArrayNo]
            wonFields.forEach(el => {
                if (currentPlayer == Player_X) winColor = winPlayerColor
                if (currentPlayer == Player_O) winColor = winAIColor
                document.querySelector('#a' + el).style.backgroundColor = winColor
            })

            //* WIN MESSAGE
            let winMsg = currentPlayer + ' WIN the game!'
            document.querySelector('.result').append(winMsg)
            removeEventListeners()

            //* POINTS
            if (currentPlayer == Player_X) {
                pointsPlayer++
                document.querySelector('#pointsPlayer').textContent = pointsPlayer
            }
            else if (currentPlayer == Player_O) {
                pointsAI++
                document.querySelector('#pointsAI').textContent = pointsAI
            }
        }
        else {
            comparsion = []
        }
    }
    //! DRAW solution
    if (emptyCells.length < 1 && !gameOver) {
        aiFirst = !aiFirst //! reversing who starts 1st
        console.log('DRAW')
        document.querySelector('.result').append('DRAW')
        gameOver = true
        removeEventListeners()

        document.querySelectorAll('.target').forEach(el => {
            el.style.backgroundColor = drawColor
        })
    }
    if (gameOver) {
        //* ENABLING radio buttons if game over
        console.warn('--- GAME OVER ---')
        console.table(gameHistory)
        gameHistory = []
        document.getElementsByName('level').forEach(el => el.disabled = false)
    }
}

function removeEventListeners() {
    let allFields = document.querySelectorAll('.target')
    allFields.forEach(el => {
        el.removeEventListener('click', playerFlip)
        console.log('removing event listener')
    })

    //! console.error('making area reset sensitive')

    let areaForReset = document.querySelectorAll('.target')
    areaForReset.forEach(el => {
        el.addEventListener('click', start)
    })
}
