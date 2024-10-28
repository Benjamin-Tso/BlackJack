const deck = {
    "D" : ["D1" , "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13"],
    "C": ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13"],
    "H" : ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12", "H13"],
    "S" : ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13"]
}
const lossMessage = "You Lost!"
const winMessage = "You Won!"
const tieMessage = "Its A Tie!"
let winRecord = getWinRecord()
console.log(winRecord)
let currentDeck
let playerCards
let dealerCards
let playerSum
let hasBlackJack
let isAlive
let isPlayerTurn
let message 
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let dealerEl = document.getElementById("dealer-el")
let newCardBtn = document.getElementById("new-card-btn")
let startGameBtn = document.getElementById("start-game-btn")
let standBtn = document.getElementById("stand-btn")
let dealerSumEl = document.getElementById("dealer-sum-el")
let winRecordEl = document.getElementById("win-record-el")
winRecordEl.innerText = `Wins: ${winRecord[0]}, Losses: ${winRecord[1]}, Win Percentage: ${(Math.floor(winRecord[0]/(winRecord[0]+winRecord[1]) * 100))}%`
function getWinRecord(){
    let temp = localStorage.getItem("win-record")
    console.log(temp)
    if(temp){
        return JSON.parse(temp)
    }
    else{
        return [0,0]
    }
}
function cardsSum(card_arr){
    let sumVal = 0
    card_arr.forEach((card) => {
        sumVal += Math.min(parseInt(card.substring(1)), 10)
    })
    return sumVal
}
function renderGame(){
    statusCheck()
    cardsEl.innerHTML = ""
    playerCards.forEach((card) => {
        let cardEl = document.createElement("img")
        cardEl.src = `images/${card}.png`
        cardsEl.appendChild(cardEl)
    })
    sumEl.innerText = playerSum   
    messageEl.innerText = message 
}
function statusCheck(){
    playerSum = cardsSum(playerCards)
    console.log(playerSum)
    if(playerSum >= 21){
        isAlive = false
        hasBlackJack = playerSum === 21
        if(hasBlackJack){
            message = winMessage
            messageEl.style.color = "blue"
            winRecord[0]++
        }
        else{
            message = lossMessage
            messageEl.style.color = "red"

            winRecord[1]++
        }
        localStorage.setItem("win-record", JSON.stringify(winRecord))
        winRecordEl.innerText = `Wins: ${winRecord[0]}, Losses: ${winRecord[1]}, Win Percentage: ${(Math.floor(winRecord[0]/(winRecord[0]+winRecord[1]) * 100))}%`
    }
    buttonStatus()
}
function stand(){
    isPlayerTurn = false
    console.log("stand")
    buttonStatus()
    dealerTurn()
}
function dealerTurn(){
    let dealerSum = 0
    let dealerInterval = setInterval(() => 
        {
            console.log("dealer turn")
            let card = getRandomCard()
            dealerCards.push(card)
            let cardEl = document.createElement("img")
            cardEl.src = `images/${card}.png`
            dealerEl.appendChild(cardEl)
            dealerSum = cardsSum(dealerCards)
            dealerSumEl.innerText = dealerSum
            if(dealerSum>16){
                let isWin = dealerSum > 21 || dealerSum < playerSum
                let isTie = dealerSum === playerSum
                if(isTie){
                    message = tieMessage
                    messageEl.style.color = "coral"
                }
                else{
                    if(isWin){
                        message = winMessage
                        messageEl.style.color = "blue"
                        winRecord[0]++
                    }
                    else{
                        message = lossMessage
                        messageEl.style.color = "red"
                        winRecord[1]++
                    }
                }
                messageEl.innerText = message
                isAlive = false
                localStorage.setItem("win-record", JSON.stringify(winRecord))
                winRecordEl.innerText = `Wins: ${winRecord[0]}, Losses: ${winRecord[1]}, Win Percentage: ${(Math.floor(winRecord[0]/(winRecord[0]+winRecord[1]) * 100))}%`
                buttonStatus()
                clearInterval(dealerInterval)
            }
        }, 1000
    )
    
}
function newCard(){
    playerCards.push(getRandomCard())
    renderGame()
}
function getRandomCard(){
    let suit = getRandomSuit()
    let index = Math.floor(suit.length * Math.random())
    let card = suit[index]
    suit.splice(index, 1)
    currentDeck[card.charAt(0)] = suit
    return card
}
function getRandomSuit(){
    let keys = Object.keys(currentDeck)
    return currentDeck[keys[Math.floor(keys.length * Math.random())]]
}
function startGame(){
    currentDeck = deck
    playerCards = []
    dealerCards = []
    playerSum = 0
    hasBlackJack = false
    isAlive = true
    isPlayerTurn = true
    message = ""
    cardsEl.innerHTML = ""
    dealerEl.innerHTML = ""
    sumEl.innerHTML = ""
    dealerSumEl.innerHTML = ""
    messageEl.innerText = "Want to play a round?"
    playerCards.push(getRandomCard())
    playerCards.push(getRandomCard())
    messageEl.style.color = "coral"
    renderGame()
}
function buttonStatus(){
    startGameBtn.disabled = isAlive
    newCardBtn.disabled = !(isAlive && isPlayerTurn)
    standBtn.disabled = !(isAlive && isPlayerTurn)
}
