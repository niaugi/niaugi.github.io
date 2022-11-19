let XOtrue = true
let tmpSymbol = String
let againstAi = false
let arr = []
let comparsion = []
let resetListener = document.querySelector('#reset').addEventListener('click', start)

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

start()

function checkbox() {
    let check = document.getElementById('checkbox')
    if (check.checked == true) {
        console.log('checkbox ON')
        againstAi = true
    } else {
        console.log('checkbox OFF')
        againstAi = false
    }
    // start()
}




function start() {
    console.log('starting...')
    tmpSymbol = 'X'
    document.querySelector('.results').innerText = ''
    let area = document.querySelectorAll('.target')
    area.forEach(el => el.innerText = '')
    checkbox()
    // area.forEach((el, index) => el.innerText = index)
    area.forEach(el => el.addEventListener('click', flip))
    arr = []
    comparsion = []

}


function flip(el) {
    if (againstAi) {
        // ------------------------ AGAINST AI ------------------------------
        tmpSymbol = 'X'
        playerMoveLogic()
        AIFlip()

    } else {
        // ------------------------ SINGLE ------------------------------

        // if (XOtrue == true) tmpSymbol = 'X'
        // else tmpSymbol = 'O'

        XOtrue ? tmpSymbol = 'X' : tmpSymbol = 'O'

        playerMoveLogic()
        XOtrue = !XOtrue
    }

    function playerMoveLogic() {
        let square = document.getElementById(el.target.id)
        if (square.innerText == '') {
            square.removeEventListener('click', flip)
            square.innerText = tmpSymbol
            makeArray()
            winCheck()
        } else {
            console.log('field already occupied')
        }
        console.log('------------------')
    }
}

function AIFlip() {
    console.log('againstAi: ' + againstAi)
    console.log('AI Move')

    let target = ''
    tmpSymbol = 'O'

    let emptyCells = []


    arr.forEach((el, index) => {
        if (el == '') {
            emptyCells.push(index)
        }
    })

    if (emptyCells.length != 0) {

        //! AI LOGIC starts here

        if (emptyCells.some(el => el == 0)) {
            target = '#a0'
        }


        else if (emptyCells.some(el => el == 4)) {
            target = '#a4'
        }

        // if (emptyCells.some(el => el % 2 == 0)) {
        //     let tmpArr = []
        //     for (let el of tmpArr) {
        //         if (el % 2 == 0) {
        //             tmpArr.push(el)
        //         }
        //     }
        //     console.log('even array indexes: ' + tmpArr)
        // }

        else {
            let rndEmptyIndex = Math.floor(Math.random() * emptyCells.length)
            target = '#a' + emptyCells[rndEmptyIndex]
        }
        document.querySelector(target).innerText = 'O'
        document.querySelector(target).removeEventListener('click', flip)
        console.log('AI target : ' + target)
        console.log('emptyCells ' + emptyCells)
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
    for (let winArrayNo = 0; winArrayNo < winArray.length; winArrayNo++) {
        for (let el of winArray[winArrayNo]) {
            comparsion.push(arr[el])
        }
        // console.log('comparsion arr: ' + comparsion)

        if (comparsion.every(el => el == tmpSymbol)) {
            let winMsg = tmpSymbol + ' WIN the game!'
            let resultsArea = document.querySelector('.results')
            resultsArea.append(winMsg)
            removeEventListeners()
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
        el.removeEventListener('click', flip)
        console.log('removing event listener')
    })
}