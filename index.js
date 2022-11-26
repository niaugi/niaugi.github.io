window.onload = check;
function check() {
    document.getElementById("level1").checked = true;
}

console.log('version 1.7 by Niaugi')
let winAIColor = '#F005'
let winPlayerColor = '#0F05'
let drawColor = '#AA05'

let gameOver = false
let playingRandomLevel = false
let currentPlayer = String
let oponentPlayer = String
let firstMove = Boolean
let aiFirst = false
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

reset()

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

function randomLevel() {
    let levelsArray = [0, 1, 2]
    let rndLevel = Math.floor(Math.random() * levelsArray.length)
    return rndLevel
}

function reset() {

    gameOver = false

    if (playingRandomLevel) {
        level = randomLevel()
        console.warn('got random level: ' + level)
    }
    console.warn('level is: ' + level)

    cheaterRemove()

    //! removing reset listener for AREA ---------------------------
    let areaForReset = document.querySelectorAll('.target')
    areaForReset.forEach(el => {
        el.removeEventListener('click', reset)
        el.style.backgroundColor = 'transparent'
    })

    //! erase & reset AREA FIELDS & RESULT --------------------------
    document.querySelector('.results').innerText = ''
    let area = document.querySelectorAll('.target')
    area.forEach(el => el.innerText = '')
    area.forEach(el => el.addEventListener('click', playerFlip))

    //! init Arrays
    arr = []
    comparsion = []

    //! who starts first logic
    if (aiFirst) {  //* aiFirst after WIN/DRAW will be INVERTED
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

//! EventListener from player press goes HERE:

function playerFlip(el) {
    if (aiFirst) {
        currentPlayer = Player_X
        playerMove()
        if (!gameOver) aiMove()
    }
    else {
        // console.error('playerFlip PLAYER FIRST')
        currentPlayer = Player_X
        playerMove()
        if (!gameOver) aiMove()
    }
    console.log('----------------------------')
    function playerMove() {
        let square = document.getElementById(el.target.id)
        if (square.innerText == '') {
            square.removeEventListener('click', playerFlip)
            square.innerText = currentPlayer
            makeArray()
            winCheck()
        } else {
            console.error('field already occupied') //! this line should never be reached :)
        }
    }
}

function aiMove() {
    console.error('AI playing level: ' + level)
    makeArray()
    let target = ''

    //! prevencinis random target
    let rndEmptyIndex = Math.floor(Math.random() * emptyCells.length)
    target = '#a' + emptyCells[rndEmptyIndex]

    //! START AI

    // if (emptyCells.length > 1) {
    if (arr.some(el => el == '')) {
        //* FIRST MOVE ONLY KAMPAI -------------------------------
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
        }

        //* CENTER -------------------------------

        else if (emptyCells.includes(4) && (!firstMove) && (level == 2)) { //! LEVEL 2 only
            console.log('esam ELSE IF INCLUDES CENTER(4)')
            target = '#a4'
            firstMove = false
        }
        //* 3rd 4nd move -------------------------------
        //! Will be reached if ANY of above gave target
        else {
            firstMove = false
            //! AI LOGIC starts here
            let winArrayVariants = winArray.length

            //* FINAL WINNING COMBINATION (3rd)
            if (level > 0) { //! LEVEL 1 & 2
                console.warn('level 1 & 2 - checking if player has winning positions')
                thirdMove(Player_X) //! check if oponent has winning combo and block it
            }
            thirdMove(Player_O) //! target will be overwritten if AI can win with this move

            function thirdMove(player) {
                currentPlayer = player
                console.error('currentPlayer: ' + currentPlayer)

                for (let i = 0; i < winArrayVariants; i++) {
                    //* checking 0&1 xxo
                    if ((arr[winArray[i][0]] == currentPlayer) && (arr[winArray[i][1]] == currentPlayer)) {
                        if (emptyCells.includes(winArray[i][2])) {
                            target = '#a' + winArray[i][2]
                        }
                    }
                    //* checking 1&2 oxx
                    else if ((arr[winArray[i][1]] == currentPlayer) && (arr[winArray[i][2]] == currentPlayer)) {
                        if (emptyCells.includes(winArray[i][0])) {
                            target = '#a' + winArray[i][0]
                        }
                    }
                    //* checking 0&2 xox
                    else if ((arr[winArray[i][0]] == currentPlayer) && (arr[winArray[i][2]] == currentPlayer)) {
                        if (emptyCells.includes(winArray[i][1])) {
                            target = '#a' + winArray[i][1]
                        }
                    }
                }
            }
        }

        if (target === '') console.error('TARGET FOR AI IS EMPTY!')

        //! MARKING TARGET ON BOARD
        document.querySelector(target).innerText = Player_O
        document.querySelector(target).removeEventListener('click', playerFlip)
        console.log('AI target : ' + target)

        //! disabling radio buttons if AI made a move
        let x = document.getElementsByName('level')
        x.forEach(el => {
            el.disabled = true
        })

        makeArray()
        winCheck()
    }
    else {
        console.log({ target })
        document.querySelector(target).innerText = Player_O
        document.querySelector(target).removeEventListener('click', playerFlip)
        let resultsArea = document.querySelector('.results')
        resultsArea.append('DRAW')
        console.log('AI removing listener')
        removeEventListeners()
    }
}

function makeArray() {
    arr = []
    let area = document.querySelectorAll('.target')
    for (el of area) {
        arr.push(el.innerText)
    }

    emptyCells = []

    //* EMPTY CELLS indexes creation
    arr.forEach((arrayEl, index) => {
        if (arrayEl == '') {
            emptyCells.push(index)
        }
    })
    // console.log('emptyCells ' + emptyCells)


}

function winCheck() {
    for (let winArrayNo = 0; winArrayNo < winArray.length; winArrayNo++) {
        for (let el of winArray[winArrayNo]) {
            comparsion.push(arr[el])
        }

        if (comparsion.every(el => el == currentPlayer)) {

            //todo UZBRAUKIT LAIMETUS LAUKELIUS

            let winColor = ''
            let wonFields = winArray[winArrayNo]
            wonFields.forEach(el => {
                if (currentPlayer == Player_X) winColor = winPlayerColor
                else {
                    winColor = winAIColor
                }
                document.querySelector('#a' + el).style.backgroundColor = winColor
            })

            //* ENABLING radio buttons if AI made a move
            let x = document.getElementsByName('level')
            console.info('ENABLING radio buttons')
            x.forEach(el => {
                el.disabled = false
            })

            let winMsg = currentPlayer + ' WIN the game!'
            let resultsArea = document.querySelector('.results')
            resultsArea.append(winMsg)
            removeEventListeners()
            gameOver = true
            aiFirst = !aiFirst //! reversing who starts 1st
            if (currentPlayer == Player_X) {
                pointsPlayer++
                document.querySelector('#pointsPlayer').textContent = pointsPlayer
                if ((pointsPlayer + 1) / (pointsAI + 1) > 3) {
                    cheater()
                }
            }
            else if (currentPlayer == Player_O) {
                pointsAI++
                document.querySelector('#pointsAI').textContent = pointsAI
            }

            return
        }
        else {
            comparsion = []
        }
    }
    //! DRAW solution
    if (emptyCells.length < 1) {
        aiFirst = !aiFirst //! reversing who starts 1st
        console.log('DRAW')
        let resultsArea = document.querySelector('.results')
        resultsArea.append('DRAW')
        gameOver = true
        removeEventListeners()

        let allFields = document.querySelectorAll('.target')
        allFields.forEach(el => {
            el.style.backgroundColor = drawColor
        })
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
        el.addEventListener('click', reset)
    })
}

function cheater() {
    document.querySelector('.cheaterArea').textContent = 'Cheater :)))'
}
function cheaterRemove() {
    document.querySelector('.cheaterArea').textContent = ''
}