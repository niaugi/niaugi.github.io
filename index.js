console.log('version 1.3 by Niaugi')
let gameOver = false
let currentPlayer = String
let oponentPlayer = String
let firstMove = Boolean  //! REMOVE when done WHO STARTS THE GAME
let aiFirst = false
let Player_O = 'O'
let Player_X = 'X'
let arr = []
let comparsion = []
let emptyCells = []
let pointsPlayer = 0
let pointsAI = 0

let winArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

let kampai = [0, 2, 6, 8]
let letMeWin_status = Boolean

reset()


function reset() {

    //! experiment with area reset
    let areaForReset = document.querySelectorAll('.target')
    areaForReset.forEach(el => {
        el.removeEventListener('click', reset)
        console.error('AREA not reset sensitive!')
    })

    cheaterRemove()
    let letMeWin = document.querySelector('#letMeWin')
    // console.log('LetMeWin status: ' + letMeWin.checked)
    if (letMeWin.checked) letMeWin_status = true
    else letMeWin_status = false

    console.warn('Final letMeWin_status = ' + letMeWin_status)



    //! erase & reset FIELDS & RESULT
    document.querySelector('.results').innerText = ''
    let area = document.querySelectorAll('.target')
    area.forEach(el => el.innerText = '')
    area.forEach(el => el.addEventListener('click', playerFlip))
    arr = []
    // arr = ['O', 'X', 'O', 'O', 'X', 'X', '', '', '']
    comparsion = []
    gameOver = false

    if (aiFirst) {
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

function playerFlip(el) {
    if (aiFirst) {
        currentPlayer = Player_X
        playerMove()
        if (!gameOver) aiMove()
    }
    else {
        console.error('playerFlip PLAYER FIRST')
        currentPlayer = Player_X
        playerMove()
        if (!gameOver) aiMove()
    }

    function playerMove() {
        let square = document.getElementById(el.target.id)
        if (square.innerText == '') {
            square.removeEventListener('click', playerFlip)
            square.innerText = currentPlayer
            makeArray()
            winCheck()
        } else {
            console.error('field already occupied')
        }
        console.log('----------------------------')
    }
}

function aiMove() {
    makeArray()

    let target = ''

    //! prevencinis random target
    let rndEmptyIndex = Math.floor(Math.random() * emptyCells.length)
    target = '#a' + emptyCells[rndEmptyIndex]

    //! START AI
    // if (emptyCells.length > 1) {
    if (arr.some(el => el == '')) {

        //* FIRST MOVE ONLY -------------------------------
        if (firstMove) {
            let firstMoveTargets = []
            emptyCells.forEach(el => {
                if (kampai.includes(el)) {
                    firstMoveTargets.push(el)
                }
            })
            target = firstMoveTargets[Math.floor(Math.random() * firstMoveTargets.length)]
            console.log('firstMoveTargets: ' + firstMoveTargets)
            firstMove = false
            target = '#a' + target
        }

        //* CENTER -------------------------------
        else if (emptyCells.includes(4)) {
            console.log('esam ELSE IF INCLUDES CENTER(4)')
            target = '#a4'
        }
        //* 3rd 4nd move -------------------------------
        else {
            //! AI LOGIC starts here
            let winArrayVariants = winArray.length

            //* FINAL WINNING COMBINATION (3rd)
            if (!letMeWin_status) {
                console.warn('HARD MODE - checking if player has winning positions')
                console.warn('letMeWin_status: ' + letMeWin_status)
                thirdMove(Player_X) //! check if oponent has winning combo and block it
            }
            thirdMove() //! target will be overwritten if AI can win with this move

            function thirdMove(oponent) {
                if (oponent == Player_X) {
                    currentPlayer = Player_X
                }
                else {
                    currentPlayer = Player_O
                }
                for (let i = 0; i < winArrayVariants; i++) {
                    if ((arr[winArray[i][0]] == currentPlayer) && (arr[winArray[i][1]] == currentPlayer)) {
                        if (emptyCells.includes(winArray[i][2])) {
                            target = '#a' + winArray[i][2]
                        }
                    }

                    else if ((arr[winArray[i][1]] == currentPlayer) && (arr[winArray[i][2]] == currentPlayer)) {
                        if (emptyCells.includes(winArray[i][0])) {
                            target = '#a' + winArray[i][0]
                        }
                    }
                    else if ((arr[winArray[i][0]] == currentPlayer) && (arr[winArray[i][2]] == currentPlayer)) {
                        if (emptyCells.includes(winArray[i][1])) {
                            target = '#a' + winArray[i][1]
                        }
                    }
                }
            }
        }

        if (target === '') console.log('TARGET FOR AI IS EMPTY!')
        //! MARKING TARGET ON BOARD
        document.querySelector(target).innerText = Player_O
        document.querySelector(target).removeEventListener('click', playerFlip)
        console.log('AI target : ' + target)

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
    console.log(arr)

    emptyCells = []

    //* EMPTY CELLS indexes creation
    arr.forEach((arrayEl, index) => {
        if (arrayEl == '') {
            emptyCells.push(index)
        }
    })
    console.log('emptyCells ' + emptyCells)

}

function winCheck() {
    // cheater()
    console.log('winCHECK')
    for (let winArrayNo = 0; winArrayNo < winArray.length; winArrayNo++) {
        for (let el of winArray[winArrayNo]) {
            comparsion.push(arr[el])
        }

        if (comparsion.every(el => el == currentPlayer)) {
            let winMsg = currentPlayer + ' WIN the game!'
            let resultsArea = document.querySelector('.results')
            resultsArea.append(winMsg)
            removeEventListeners()
            gameOver = true
            aiFirst = !aiFirst //! reversing who starts 1st
            if (currentPlayer == Player_X) {
                pointsPlayer++
                document.querySelector('#pointsPlayer').textContent = pointsPlayer
                if ((pointsPlayer + 1) / (pointsAI + 1) > 2) {
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
    }
}

function removeEventListeners() {
    let allFields = document.querySelectorAll('.target')
    allFields.forEach(el => {
        el.removeEventListener('click', playerFlip)
        console.log('removing event listener')
    })

    //todo Make reset on area

    console.error('making area reset sensitive')

    let areaForReset = document.querySelectorAll('.target')
    areaForReset.forEach(el => {
        el.addEventListener('click', reset)
        console.error('AREA RESET SENSITIVE!')
    })


}


function cheater() {
    document.querySelector('.cheaterArea').textContent = 'Cheater :)))'
}

function cheaterRemove() {
    document.querySelector('.cheaterArea').textContent = ''
}