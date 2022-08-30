//SEARCH FOR PLAYERS
//form submission event listener
const searchForm = document.querySelector('#search-form')
searchForm.addEventListener('submit',handleSearch)

// handle search submit
function handleSearch(e){
    e.preventDefault()
    //clear any former results or stat card
    const resultsContainer = document.querySelector('#results-container')
    const cardContainer = document.querySelector('#stat-card')
    cardContainer.innerHTML = ''
    resultsContainer.innerHTML = ''
    // fetch search results 
    fetch(`https://www.balldontlie.io/api/v1/players?search=${e.target[0].value}`)
        .then((resp) => resp.json())
        .then((players) => {
            players.data.forEach((player) => displaySearchResult(e, player))
        })
}

// display search results
function displaySearchResult(e, player){
    const resultsContainer = document.querySelector('#results-container')
    // create player card element and populate
    const playerCard = document.createElement('div')
    playerCard.className = 'player-card'
    playerCard.id = `${player.id}`
    playerCard.innerHTML = `
        <div class='name' id='${player.id}'>${player.first_name} ${player.last_name}</div>
        <div class='position' id='${player.id}' >${player.position}</div>
        <div class='team' id='${player.id}'>${player.team.abbreviation}</div>
    `
    // add listener for player card
    playerCard.addEventListener('click',handlePlayerClick)
    resultsContainer.appendChild(playerCard)
    // clear search box
    e.target[0].value = ''
}


// HANDLE CLICK ON PLAYER
async function handlePlayerClick(e){
    const resultsContainer = document.querySelector('#results-container')
    //find player name and ID
    let targetName
    if(e.path.length === 6){
        targetName = e.path[0].childNodes[1].innerText
    }else{
        targetName = e.path[1].childNodes[1].innerText
    }
    const targetId = e.target.id
    // getStats
    let playerStats = await getStats(targetName, targetId)
    createPlayerCard(playerStats, targetName)
}

function createPlayerCard(playerStats, targetName){
    const resultsContainer = document.querySelector('#results-container')
    const cardContainer = document.querySelector('#stat-card')
    resultsContainer.innerHTML = `<h2 id='name-header'>${targetName}</h2>`
    console.log(playerStats)
    console.log(Object.keys(playerStats[0]))

}


async function getStats(targetName, targetId){
    let season = 2017
    let stats = []
    for(let i=0; i <= 4; i++){
        await fetch(`https://www.balldontlie.io/api/v1/season_averages?season=${season}&player_ids[]=${targetId}`)
            .then((resp) => resp.json())
            .then((seasonStats) => {
                if(seasonStats.data.length > 0){
                    stats.push(seasonStats.data[0]) 
                }else{
                    return
                }
        })
    season += 1
    }
    return stats
}

// //create stat card for clicked on player
// async function createStatCard(targetName, targetId){
//     //clear search and add player name
//     const resultsContainer = document.querySelector('#results-container')
//     const cardContainer = document.querySelector('#stat-card')
//     resultsContainer.innerHTML = `<h1 id='name-header'>${targetName}</h1>`
//     //make a container for the table headers
//     createStatCategories()
//     //get players stats
//     let season = 2017
//     for(let i=0; i <= 4; i++){
//         await fetch(`https://www.balldontlie.io/api/v1/season_averages?season=${season}&player_ids[]=${targetId}`)
//             .then((resp) => resp.json())
//             .then((seasonStats) => {
//                 if(seasonStats.data.length > 0){
//                     makeSeasonSection(seasonStats.data[0]) 
//                 }else{
//                     return
//                 }

//         })
//     season += 1
//     }

// }

// function createStatCategories(){
//     let statCard = document.querySelector('#stat-card');
//     let seasonSection = document.createElement('div');
//     seasonSection.className = 'season-card'
//     seasonSection.innerHTML = `
//         <button class='stat-btn'><strong>YEAR:</button>
//         <button class='stat-btn'><strong>PTS:</strong></button>
//         <button class='stat-btn'><strong>AST:</strong></button>
//         <button class='stat-btn'><strong>REB:</strong></button>
//         <button class='stat-btn'><strong>STL:</strong></button>
//         <button class='stat-btn'><strong>BLK:</strong></button>
//         <button class='stat-btn'><strong>3PM:</strong></button>
//         <button class='stat-btn'><strong>FG%:</strong></button>
//         <button class='stat-btn'><strong>FT%:</strong></button>
//         <button class='stat-btn'><strong>3P%:</strong></button>
//         <button class='stat-btn'><strong>GAP:</strong></button>
//     `
//     statCard.appendChild(seasonSection)
// }

// function makeSeasonSection(seasonStats){
//     let statCard = document.querySelector('#stat-card');
//     let seasonSection = document.createElement('div');
//     seasonSection.className = 'season-card'
//     seasonSection.innerHTML = `
//         <p><strong>${seasonStats.season}</strong></p>
//         <p>${seasonStats.pts}</p>
//         <p>${seasonStats.ast}</p>
//         <p>${seasonStats.reb}</p>
//         <p>${seasonStats.stl}</p>
//         <p>${seasonStats.blk}</p>
//         <p>${seasonStats.fg3m}</p>
//         <p>${seasonStats.fg_pct}</p>
//         <p>${seasonStats.ft_pct}</p>
//         <p>${seasonStats.fg3_pct}</p>
//         <p>${seasonStats.games_played}</p>
//     `
//     statCard.appendChild(seasonSection)
// }

function editChart(stats){
    let i = 0
    const dataPoints = document.getElementsByClassName('data-point')
    maximum = Math.max.apply(Math, stats)
    for(let stat of stats){
        dataPoints[i].style.marginTop = `${(1 - (stat / maximum)) * 200}px`
        i ++
    }
}

