const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const MATCHES_URL = `${BASE_URL}/matches`
const mainUserProfileBttn = document.getElementById("user-profile-button")
const mainCard = document.getElementById("card")
const matchArea = document.getElementById('match-area')
const loginBttn = document.getElementsByClassName("submit")[0]
const topBar = document.getElementsByClassName("top-bar")[0]
const loginForm = document.getElementById("user-login")
const createAccountForm = document.getElementById("new-account")
const createAccountFields = document.getElementsByClassName("create-input-text")
const matchCard = document.getElementsByClassName("match-card")[0]
const createAccountBttn = document.getElementById("create-account-submit")
let currentUser = ""
let potentials = []
const otherPeople = []
// const EventRende = [renderDeleteEvent]




function signIn (){
  if (currentUser === "") {
    mainUserProfileBttn.replaceWith("")
    loginBttn.addEventListener("click", () => {
    event.preventDefault()
    currentUser = document.getElementsByClassName("input-text")[0].value
    fetch(USERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: currentUser
      }) 
    })
    .then(resp => resp.json())
    .then(data => {
      potentials = data.potentials
      currentUser = data.user
      populateCard()
    })

    const newBttn = document.createElement('button')
    newBttn.id = "user-profile-button"
    newBttn.innerText="Your Profile"
    topBar.appendChild(newBttn)
    loginForm.replaceWith("")
    createAccountForm.replaceWith("")
    mainUserProfile()
    fetchMatches()
    })
   
  } else {
    
    
  }
}

function createUser(){
  createAccountBttn.addEventListener("click", (event) => {
    event.preventDefault()
    fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: createAccountFields[0],
        email: createAccountFields[1],
        bio: createAccountFields[2],
        gender: createAccountFields[3],
        age: createAccountFields[4],
        img_url: createAccountFields[5]
      })
    })
    createAccountFields[0].value = ""
    createAccountFields[1].value = ""
    createAccountFields[2].value = ""
    createAccountFields[3].value = ""
    createAccountFields[4].value = ""
    createAccountFields[5].value = ""
  })
}

function mainUserProfile(){
  const newBttn = document.getElementById("user-profile-button")
  newBttn.addEventListener("click", () => {
    fetch(USERS_URL)
    .then(resp => resp.json())
    .then(userData => {
      console.log(userData)
      userOwnCard(userData)
    })
  
  })
}

function userOwnCard(userData){
  let foundUser = userData.find(user => user.name === currentUser.name)
  mainCard.innerHTML = `
  <img id="img" src= "${foundUser.img_url}" height='240' width='240'>
  <h2><b>${foundUser.name}</b></h2>
  <p>${foundUser.age} Years Old</p>
  <em>"${foundUser.bio}"</em> 
  `
}

function populateCard() {
  let firstPerson = potentials.shift()
  mainCard.innerHTML = `
  <img id="img" src= "${firstPerson.img_url}" height='240' width='240'>
  <h2><b>${firstPerson.name}</b></h2>
  <p>${firstPerson.age} Years Old</p>
  <em>"${firstPerson.bio}"</em>
  <button id="dislike">👹</button>
  <button id="like">😍</button>
  `
}

function fetchMatches(){
  if (currentUser !== "") {
    fetch(MATCHES_URL)
    .then(resp => resp.json())
    .then(matchData => {
    findUser(matchData)
    })
    `<button id="delete">delete</button>`
  }
}

function findUser(matchData) {
  let foundMatch = matchData.filter(match => match.user.name === currentUser.name || match.user_two.name === currentUser.name)
  console.log(matchData)
  for (const match of foundMatch) {
    if (match.user.name !== currentUser.name) {
      if (!otherPeople.includes(match.user)){
        otherPeople.push(match.user)
      }
    } else if (match.user_two.name !== currentUser.name) {
        if (!otherPeople.includes(match.user_two)){
          otherPeople.push(match.user_two)
        }
    }
  }

  


//   function renderDeleteEvent() {
//     const deleteButton = document.getElementsByClassName("delete")
//     deleteButton.addEventListener("click", deleteMatch)
// }

  // function deleteMatch(event) {
  //   const match = event.target.dataset.matchId 
  //   const url = "http://localhost:3000/matches" + "/" + matchId 
  //   fetch(url, {method: "delete"})
  //   .then(resp => resp.json())
  //   .then(json => fetchMatches())
  // }
  



console.log(otherPeople)
  matchCard.style = "background-color:rgb(124, 255, 255)"
  matchCard.innerHTML = ""
   for (const person of otherPeople) {
      matchCard.innerHTML += `
      <div class="match-card">
       <img src= "${person.img_url}" class='${person.id}' height="100" width="100">
       <p>${person.name}</p>
       <button id="match-info">i</button>
      </div><br><br>`
   }
}

signIn()
createUser()
// mainUserProfile()
// fetchMatches()
