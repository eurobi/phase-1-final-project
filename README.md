# phase-1-final-project

# SUMMARY
This project is a single page web application for the purposes of assisting with a fantasy basketball draft.  

# FUNCTIONALITY - USER FACING
When users navigate to the page they will find a title with a single search bar where they can enter any active or former NBA player.

The results of the search will appear in individual cards, up to 25 results.  Those cards will include a players name, position (if available in the DB), and team.

A user can click on any individual player and all other players will dissapear. The clicked on players stats for the past 5 years will display on the page.  If they don't have stats for all 5 years, available years will show. If there are no stats for that player for the last 5 years, an alert will appear.

The user can click on any stat to display a chart of that stat over the available years.

If the user wants to add that player to their 'team', they can click the plus button next to the players name.  A side bar will display, featuring the players chosen and their cummulative stats.



# FUNCTIONALITY - HOW IT WORKS

SEARCH
The search form has a submit event listener that takes the user input and runs a GET request to the 'BallDontLie' API for players matching the search query.  for each player in the results we create a player card that displays in a search results container on the page.

# PLAYER CLICK
On each player card we add an event listener for a click on the card.  That event listener takes the player ID from the element and runs a GET request for their season averages over the last 5 years.  we use Async/Await to make sure that results come back in order and then we create a table with those stats. the searh result container is cleared and the player stats container is populated with the table.

# STAT CLICK
on each stat category we add an event listener for click.  On click, a graph div is added in the table that contains a chart plotting that stat over the last 5 years.  The margin-top for each data point is based on the stat versus the max. clicking on a different stat will clear the old graph and create a new one. if the same stat is clicked twice we remove that graph.

# ADD PLAYER CLICK
There is an event listener on the add player button which creates a side-bar and displays a new table.  The added players most recent years stats will be pulled from the table and added to the new table and the sum/avg of each stat is displayed.


