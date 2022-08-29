//SEARCH FOR PLAYERS
//Handle search from submission
const searchForm = document.querySelector('#search-form')
searchForm.addEventListener('submit',handleSearch)

function handleSearch(e){
    e.preventDefault()
    const resultsContainer = document.querySelector('#results-container')
    const cardContainer = document.querySelector('#stat-card')
    cardContainer.innerHTML = ''
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

async function createStatCard(targetName, targetId){
    //clear search
    const resultsContainer = document.querySelector('#results-container')
    const cardContainer = document.querySelector('#stat-card')
    resultsContainer.innerHTML = `<h1 id='name-header'>${targetName}</h1>`
    
    //get stats
    let season = 2017
    for(let i=0; i <= 4; i++){
        await fetch(`https://www.balldontlie.io/api/v1/season_averages?season=${season}&player_ids[]=${targetId}`)
            .then((resp) => resp.json())
            .then((seasonStats) => {
                if(seasonStats.data.length > 0){
                    makeSeasonSection(seasonStats.data[0]) 
                }else{
                    return
                }

        })
    season += 1
    }

}

function makeSeasonSection(seasonStats){
    let statCard = document.querySelector('#stat-card');
    let seasonSection = document.createElement('div');
    seasonSection.className = 'season-card'
    seasonSection.innerHTML = `
        <p><strong>${seasonStats.season}</strong></p>
        <p>PTS: ${seasonStats.pts}</p>
        <p>AST: ${seasonStats.ast}</p>
        <p>REB: ${seasonStats.reb}</p>
        <p>STL: ${seasonStats.stl}</p>
        <p>BLK: ${seasonStats.blk}</p>
        <p>3PM: ${seasonStats.fg3m}</p>
        <p>FG%: ${seasonStats.fg_pct}</p>
        <p>FT%: ${seasonStats.ft_pct}</p>
        <p>3P%: ${seasonStats.fg3_pct}</p>
        <p>GP: ${seasonStats.games_played}</p>
    `
    statCard.appendChild(seasonSection)
}

