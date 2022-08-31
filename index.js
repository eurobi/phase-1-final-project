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
    //get needed page elements and add palyer title
    const resultsContainer = document.querySelector('#results-container')
    const cardContainer = document.querySelector('#stat-card')
    resultsContainer.innerHTML = `
    <div id='name-and-add'>
        <h2 id='name-header'>${targetName}</h2>
        <button title='Add to Team' id='add-player-btn'>+</button>
    </div>
    `
    console.log(playerStats)
    //create table
    const statTable = document.createElement('table')
    //add table headers
    const tableHeaders = document.createElement('tr')
    tableHeaders.innerHTML = `<th>Stat</th>`
    for(let year of playerStats){
        let yearSeason = document.createElement('th')
        yearSeason.innerText = year['season']
        tableHeaders.appendChild(yearSeason)
    }
    statTable.appendChild(tableHeaders)
    //add rest of stats
    const tableKey = {
        pts : 'Points',
        reb : 'Rebounds',
        ast : 'Assists',
        stl : 'Steals',
        blk : 'Blocks',
        fg3m : '3 Pointers',
        fg_pct : 'FG%',
        ft_pct : 'FT%',
        fg3_pct: '3PT%',
        min : 'Minutes',
        games_played : 'GP'
    }
    for(let category of Object.entries(tableKey)){
        let row = document.createElement('tr')
        let cat = document.createElement('td')
        cat.innerHTML = `<button class='stat-btn'>${category[1]}</button>`
        row.appendChild(cat)
        for(let year of playerStats){
            let yearStat = document.createElement('td')
            yearStat.innerText = year[category[0]]
            row.appendChild(yearStat)
        }
        statTable.appendChild(row)
    }
    cardContainer.appendChild(statTable)
    addStatButtonListeners()
    addPlayerButtonListener()
}

function addStatButtonListeners(){
    const statButtons = document.getElementsByClassName('stat-btn')
    for(let i = 0; i < statButtons.length; i++){
        statButtons[i].addEventListener('click', handleStatButtonClick)
    }
}

function addPlayerButtonListener(){
    const addPlayerButton = document.querySelector('#add-player-btn')
    addPlayerButton.addEventListener('click', handleAddPlayer)
}

function handleAddPlayer(e){
    console.log(e.target)
}

function handleStatButtonClick(e){
    let currentChart = document.querySelector('#chart-container')
    if(e.target.className == 'pressed-stat-btn'){
        console.log('ran')
        currentChart.remove()
        e.target.className = 'stat-btn'
    }
    else{
        if(currentChart !== null){
            currentChart.remove()
        }
        removePressedButton()
        createPressedButton(e)
        const selectedRow = e.target.parentNode.parentNode
        const chartTd = document.createElement('td')
        chartTd.colSpan = 6
        chartTd.id = "chart-container"
        const chartDiv = document.createElement('div')
        chartDiv.id = 'chart-test'
        for(let i = 1; i < selectedRow.childNodes.length; i++){
            let dataPointDiv = document.createElement('div')
            dataPointDiv.id = `d${i}`
            dataPointDiv.className = 'data-point'
            chartDiv.appendChild(dataPointDiv)
        }
        chartTd.appendChild(chartDiv)
        const rowCells = selectedRow.querySelectorAll('td')
        const rowStats = []
        for(let ele of rowCells){
            rowStats.push(ele.innerText)
        }
    
        selectedRow.parentNode.insertBefore(chartTd, selectedRow.nextSibling)
        editChart(rowStats.slice(1))

    }
    
}

function removePressedButton(){
    let pressedBtn = document.querySelector('.pressed-stat-btn')
    if(pressedBtn !== null){
        pressedBtn.className = 'stat-btn'
    }
}

function createPressedButton(e){
    e.target.className = 'pressed-stat-btn'
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


function editChart(stats){
    let i = 0
    const dataPoints = document.getElementsByClassName('data-point')
    maximum = Math.max.apply(Math, stats)
    for(let stat of stats){
        dataPoints[i].style.marginTop = `${(1 - (stat / maximum)) * 200}px`
        i ++
    }
}

