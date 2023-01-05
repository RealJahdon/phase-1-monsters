const URL = "http://localhost:3000/monsters"

const monsterContainer = document.getElementById("monster-container")
const monsterFormDiv = document.getElementById("create-monster")
const backButton = document.getElementById("back")
const forwardButton = document.getElementById("forward")

form = document.createElement("form")
form.dataset.type = "form"

inputName = document.createElement("input")
inputName.placeholder = "Name..."

inputAge = document.createElement("input")
inputAge.placeholder = "Age..."

inputDesc = document.createElement("input")
inputDesc.placeholder = "Description..."

inputSub = document.createElement("input")
inputSub.setAttribute('type',"submit")
inputSub.setAttribute('value',"Submit")

form.appendChild(inputName)
form.appendChild(inputAge)
form.appendChild(inputDesc)
form.appendChild(inputSub)
monsterFormDiv.appendChild(form)

let pageNumber = 1
let pageCounter = 0

function countMonsters(){
    fetch(URL)
    .then(resp => resp.json())
    .then(json => pageCounter = Object.keys(json).length)
}
countMonsters()

document.addEventListener("DOMContentLoaded", function(){
    let monsterForm = document.querySelector(`[data-type="form"]`)

    function fetchMonsters(pageNumber){
        fetch(`${URL}/?_limit=50&_page=${pageNumber}`)
        .then(resp => resp.json())
        .then(json => json.forEach(renderMonsters))
    }

    function renderMonsters(monster){
        const divContainer = document.createElement("div")
        divContainer.dataset.id = `${monster.id}`

        const name = document.createElement("h1")
        name.innerText = `${monster.name}`

        const age = document.createElement("h4")
        age.innerText = `Age: ${monster.age}`

        const desc = document.createElement("p")
        desc.innerText = `Description: ${monster.description}`

        divContainer.appendChild(name)
        divContainer.appendChild(age)
        divContainer.appendChild(desc)
        monsterContainer.appendChild(divContainer)
    }

    function forwardHandler(e) {
        pageNumber++
        if((pageCounter - (pageNumber * 50)) > -50){
            monsterContainer.innerHTML = ''
            fetchMonsters(pageNumber)
        }else {
            pageNumber--
        }
    }

    function backHandler(e) {
        if(pageNumber > 1){
            monsterContainer.innerHTML = ''
            pageNumber--
            fetchMonsters(pageNumber)
        }
    }

    function formHandler(e){
        e.preventDefault()
        let getName = e.target[0].value
        let getAge = e.target[1].value
        let getDesc = e.target[2].value
        let monstObj = {
            name: getName,
            age: getAge,
            description: getDesc
        }

        fetch(URL,{
            method: "POST",
            headers: {
                "content-type": "application/json",
                accepts: "application/json"
            },
            body: JSON.stringify(monstObj)
        })

    }

    fetchMonsters()
    forwardButton.addEventListener("click", forwardHandler)
    backButton.addEventListener("click", backHandler)
    monsterForm.addEventListener("submit", formHandler)
})