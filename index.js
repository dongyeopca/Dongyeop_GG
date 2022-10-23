const express = require("express");
const request = require("request");
const app = express();

const api = "RGAPI-ca0e6a99-53b4-4ae5-b6f9-443b7077d242";
const PORT = 3000;
app.use(express.static("public"));
app.get("/summoner", (req, res) => {
  const summoner = req.query.name;
  const options = {
    uri: encodeURI(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`
    ),
    headers: { "X-Riot-Token": api },
  };
  request.get(options, function (err, response, body) {
    if (err) {
      console.log(err);
    }
    if (response) {
      res.send(body);
    }
  });
});

app.get("/summoner_tier", (req, res) => {
  const id = req.query.name;
  const options = {
    uri: `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
    headers: { "X-Riot-Token": api },
  };
  request.get(options, function (err, response, body) {
    if (err) {
      console.log(err);
    }
    if (response) {
      res.send(body);
    }
  });
});

app.get("/match", (req, res) => {
  const puuid = req.query.puuid;
  const start = req.query.startTime;
  const end = req.query.endTime;
  const options = {
    uri: `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${start}&endTime=${end}&type=ranked`,
    headers: { "X-Riot-Token": api },
  };
  request.get(options, function (err, response, body) {
    if (err) {
      console.log(err);
    }
    if (response) {
      res.send(body);
    }
  });
});

app.get("/matchdata", (req, res) => {
  const matchid = req.query.matchid;
  const options = {
    uri: `https://asia.api.riotgames.com/lol/match/v5/matches/${matchid}`,
    headers: { "X-Riot-Token": api },
  };
  request.get(options, function (err, response, body) {
    if (err) {
      console.log(err);
    }
    if (response) {
      res.send(body);
    }
  });
});
app.listen(PORT, () => {
  console.log("Server listening on port 3000");
});
