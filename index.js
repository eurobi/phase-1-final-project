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
                    <div class='name' id='${player.id}'>${player.first_name} ${player.last_name}</div>
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
    const resultsContainer = document.querySelector('#results-container')
    let targetName
    if(e.path.length === 6){
        targetName = e.path[0].childNodes[1].innerText
    }else{
        targetName = e.path[1].childNodes[1].innerText
    }
    const targetId = e.target.id
    createStatCard(targetName, targetId)
}

function createStatCard(targetName, targetId){
    const resultsContainer = document.querySelector('#results-container')
    resultsContainer.innerHTML = `${targetName}`
    let stats = getStats(targetId)
    console.log(stats)

}

function getStats(targetId){
    let playerStats = []
    let season = 2021
    for(let i=0; i <= 4; i++){
        fetch(`https://www.balldontlie.io/api/v1/season_averages?season=${season}&player_ids[]=${targetId}`)
            .then((resp) => resp.json())
            .then((seasonStats) => {
                playerStats.push(seasonStats.data)  
        })
    season -= 1
    }
    return playerStats
    
}
