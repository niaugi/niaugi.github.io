let gameOver = false
let currentPlayer = String
let oponentPlayer = String
let againstAi = true
let firstMove = true  //! REMOVE when done WHO STARTS THE GAME
let aiFirst = true
let Player_O = 'O'
let Player_X = 'X'
let arr = []
let comparsion = []



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

reset()

function checkbox() {
    //! not working correctly - must rest the game ?
    let check = document.getElementById('checkbox')
    if (check.checked == true) {
        console.log('checkbox ON')
        againstAi = true

    } else {
        console.log('checkbox OFF')
        againstAi = false
    }
}

function start_test() {
    document.querySelector('.results').innerText = ''
    let area = document.querySelectorAll('.target')
    area.forEach(el => el.addEventListener('click', playerFlip))
    comparsion = []
    gameOver = false
    firstMove = false
    aiMove()
}


function reset() {
    //! erase & reset FIELDS & RESULT
    document.querySelector('.results').innerText = ''
    let area = document.querySelectorAll('.target')
    area.forEach(el => el.innerText = '')
    area.forEach(el => el.addEventListener('click', playerFlip))
    arr = []
    // arr = ['O', 'X', 'O', 'O', 'X', 'X', '', '', '']
    comparsion = []
    gameOver = false
    firstMove = true


    // todo WHO STARTS THE GAME?

    aiFirst = true

    if (aiFirst) {
        currentPlayer = Player_O
        oponentPlayer = Player_X
        aiMove()
    }
    else {
        currentPlayer = Player_X
        oponentPlayer = Player_O
    }


}


//todo LOGIC for oponent did 2 xx, block last




function playerFlip(el) {
    if (againstAi) {
        // ------------------------ AGAINST AI ------------------------------
        currentPlayer = Player_X
        // aiMove()
        // if (!gameOver) playerMove()
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
            console.log('field already occupied')
        }
        console.log('------------------')
    }
}

function aiMove() {
    console.debug('esam aiMove')
    // console.log('againstAi: ' + againstAi)
    // console.log('AI Move')

    makeArray()

    let target = ''
    currentPlayer = Player_O
    let emptyCells = []

    //* EMPTY CELLS indexes creation
    arr.forEach((arrayEl, index) => {
        if (arrayEl == '') {
            emptyCells.push(index)
        }
    })
    console.log('emptyCells ' + emptyCells)

    //! START AI
    if (emptyCells.length != 0) {

        //* FIRST MOVE ONLY
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

        //* CENTER
        else if (emptyCells.includes(4)) {
            console.log('esam ELSE IF INCLUDES CENTER(4)')
            target = '#a4'
        }

        else {

            //! prevencinis random target
            let rndEmptyIndex = Math.floor(Math.random() * emptyCells.length)
            target = '#a' + emptyCells[rndEmptyIndex]
            let prevencinis = true

            //todo BLOCKING MOVE
            //! AI LOGIC starts here
            let winArrayVariants = winArray.length


            //todo check if AI has to block players 3rd move

            //* FINAL WINNING COMBINATION (3rd)
            let alarma = thirdMove(Player_X)
            console.log({ alarma })
            if (alarma) thirdMove()


            function thirdMove(oponent) {
                let gresme = false
                if (oponent == Player_X) {
                    currentPlayer = Player_X
                    console.error('oponent == Player_X')
                }
                else {
                    currentPlayer = Player_O
                    console.warn('oponent == Player_O')
                }
                for (let i = 0; i < winArrayVariants; i++) {
                    //! winArray[0,1,2] ar 0,1 yra x,x?
                    if ((arr[winArray[i][0]] == currentPlayer) && (arr[winArray[i][1]] == currentPlayer)) {
                        if (emptyCells.includes(winArray[i][2])) {
                            gresme = true
                            target = '#a' + winArray[i][2]
                            prevencinis = false
                        }
                    }

                    else if ((arr[winArray[i][1]] == currentPlayer) && (arr[winArray[i][2]] == currentPlayer)) {
                        if (emptyCells.includes(winArray[i][0])) {
                            gresme = true
                            target = '#a' + winArray[i][0]
                            prevencinis = false
                        }
                    }
                    else if ((arr[winArray[i][0]] == currentPlayer) && (arr[winArray[i][2]] == currentPlayer)) {
                        if (emptyCells.includes(winArray[i][1])) {
                            gresme = true
                            target = '#a' + winArray[i][1]
                            prevencinis = false
                        }
                    }
                }
                return gresme
            }

            console.log({ prevencinis })

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
}

function winCheck() {
    console.log('winCHECK')
    for (let winArrayNo = 0; winArrayNo < winArray.length; winArrayNo++) {
        for (let el of winArray[winArrayNo]) {
            comparsion.push(arr[el])
        }
        // console.log('comparsion arr: ' + comparsion)

        if (comparsion.every(el => el == currentPlayer)) {
            let winMsg = currentPlayer + ' WIN the game!'
            let resultsArea = document.querySelector('.results')
            resultsArea.append(winMsg)
            removeEventListeners()
            gameOver = true
            return
        }
        else {
            comparsion = []
        }
    }
}

function removeEventListeners() {
    let allFields = document.querySelectorAll('.target')
    allFields.forEach(el => {
        el.removeEventListener('click', playerFlip)
        console.log('removing event listener')
    })
}