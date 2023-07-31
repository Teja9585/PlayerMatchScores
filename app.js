const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path =  require('path')
const dbPath = path.join(__dirname, "cricketMatchDetails.db")
const app = express();
app.use(express.json())
let db = null;
const initializeDbAndServer =async() => {
     try {
         database = await open({
         filename: dbPath,
         driver: sqlite3.Database,
          });
      app.listen(3000, () =>
             console.log("Server Running at http://localhost:3000/")
        ); 
 }

    catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

 initializeDbAndServer();

const convertDbPlayerObjToResponseObj = (dbObj)=> {
       return {  playerId :dbObj.player_id,
         playerName: dbObj.player_name,

       }
};
const convertDbMatchDetailsObjToResponseObj = (dbObj)=> {
     return {    matchId :dbObj.match_id,
         match: dbObj.match,
         year: dbObj.year,
     }
};

// API-1
app.get('/players/', async(req,res) => {
 const getPlayersQuery = `
 SELECT * 
 FROM player_details`
 const playersArray = await database.all(getPlayersQuery)
 res.send(playersArray.map((eachPlayer)=>
        convertDbPlayerObjToResponseObj(eachPlayer)
         )
      )

});

//API-2  

app.get('/players/:playerId/', async(req,res) => {
    const {playerId} = req.params;
    const getPlayerQuery = `
 SELECT * 
 FROM 
 player_details
 WHERE player_id = ${playerId};
 `
 const player = await database.get(getPlayerQuery)
 res.send(convertDbPlayerObjToResponseObj(player))

});


// API_3 
app.put("/players/:playerId/", async(req,res) => {
    const {playerId} = req.params;
    const {playerName} = req.body; 
    const updatePlayerQuery = 

   `UPDATE 
       player_details
   SET 
   player_name = ${playerName}
   WHERE 
   player_id = ${playerId};`;

   await database.run(updatePlayerQuery)
   res.send('Player Details Updated')
});

// API-4 
app.get('/matches/:matchId',async(req,res) => {
    const {matchId} = req.params
    const getMatchesQuery = `
    SELECT * FROM match_details 
    WHERE match_id = ${matchId}
    ;`;
    const match = await database.get(getMatchesQuery)
    res.send(convertDbMatchDetailsObjToResponseObj(match)
    )
    
})

// API-5 
app.get("players/:playerId/matches/", async(req,res) =>{
    const {playerId} = req.params;
    const playerMatchesQuery = 
    `SELECT * FROM 
    player_match_score
     NATURAL JOIN match_details 
    WHERE player_id = ${playerId};`;
   const playerMatches = await database.all(playerMatchesQuery)
    res.send(
        playerMatches.map((eachMatch)=>
        convertDbMatchDetailsObjToResponseObj(eachMatch)
    )

    );
});


