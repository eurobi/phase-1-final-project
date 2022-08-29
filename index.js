//SEARCH FOR PLAYERS
//Handle search from submission
const searchForm = document.querySelector('#search-form')
searchForm.addEventListener('submit',handleSearch)

function handleSearch(e){
    e.preventDefault()
    const resultsContainer = document.querySelector('#results-container')
    resultsContainer.innerHTML = ''
    fetch(`https://www.balldontlie.io/api/v1/players?search=${e.target[0].value}`)
        .then((resp) => resp.json())
        .then((players) => {
            players.data.forEach((player) => {
                const playerCard = document.createElement('div')
                playerCard.className = 'player-card'
                playerCard.id = `${player.id}`
                playerCard.innerHTML = `
                    <div class='name'><strong id='${player.id}'>${player.first_name} ${player.last_name}</strong></div>
                    <div class='position' id='${player.id}' >${player.position}</div>
                    <div class='team' id='${player.id}'>${player.team.abbreviation}</div>
                `
                playerCard.addEventListener('click',handlePlayerClick)
                resultsContainer.appendChild(playerCard)
                e.target[0].value = ''
            })
        })
}

// HANDLE CLICK ON PLAYER

function handlePlayerClick(e){
    console.log(e.target.id)
    const resultsContainer = document.querySelector('#results-container')
    fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2021&player_ids[]=${e.target.id}`)
        .then((resp) => resp.json())
        .then((player) => {console.log(player.data)
    })
}

// fetch('https://www.balldontlie.io/api/v1/season_averages?player_ids[]=237')
//     .then((resp) => resp.json())
//     .then((data) => {
//         console.log(data)
//     })