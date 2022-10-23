const data = new URLSearchParams(window.location.search).get("name");
if (data == "") {
  alert("소환사명을 입력해주세요");
  history.back();
} else {
  summoner()
    .then((response) => {
      if (response.status) {
        alert("존재하지 않는 소환사명입니다.");
        history.back();
      } else {
        // const $loading = document.querySelector(".loading");
        console.log("summoner", response);
        const summoner_name = document.querySelector(".summonerName");
        summoner_name.innerHTML = response.name;
        const summoner_profile = document.querySelector(".profileIcon");
        summoner_profile.innerHTML = `<img src="http://ddragon.leagueoflegends.com/cdn/12.9.1/img/profileicon/${response.profileIconId}.png" />`;
        const summoner_level = document.querySelector(".summonerLevel");
        summoner_level.innerHTML = response.summonerLevel;
        // $loading.style.display = "none";
        const $loading = $(".loading");
        const $visible = $(".Container");
        $loading.css("display", "none");
        $visible.css("display", "block");
        sessionStorage.setItem(data, response.puuid);
        summonerTier(response.id);
      }
    })
    .catch((err) => {
      alert(err);
    });
}

function summoner() {
  return new Promise(function (resolve, reject) {
    const httprequest = new XMLHttpRequest();
    httprequest.onreadystatechange = () => {
      if (httprequest.readyState === XMLHttpRequest.DONE) {
        if (httprequest.status === 200) {
          resolve(JSON.parse(httprequest.response));
        } else {
          reject(httprequest.status);
        }
      }
    };
    httprequest.open("GET", `http://localhost:3000/summoner?name=${data}`);
    httprequest.send();
  });
}

function summonerTier(data) {
  const httprequest = new XMLHttpRequest();
  httprequest.onreadystatechange = () => {
    if (httprequest.readyState === XMLHttpRequest.DONE) {
      if (httprequest.status == 200) {
        const result = JSON.parse(httprequest.response);
        console.log(result);
        const tierBox = document.querySelector(".TierBox");
        if (result.length == 0) {
          tierBox.innerHTML = "현재시즌 랭크기록이 존재하지 않습니다 :)";
        } else {
          const data = result[0];
          console.log(data);
          tierBox.innerHTML = `<img width=150px src="../media/Emblem_${data.tier}.png"/><div>${data.tier} ${data.rank}</div><div>승:${data.wins} 패:${data.losses}</div>`;
        }
      }
    }
  };
  httprequest.open("GET", `http://localhost:3000/summoner_tier?name=${data}`);
  httprequest.send();
}

function match() {
  const puuid = sessionStorage.getItem(data);
  const start = Math.floor(
    Date.parse(document.querySelector('input[name="start"]').value) / 1000
  );
  const end = Math.floor(
    Date.parse(document.querySelector('input[name="end"]').value) / 1000
  );
  return new Promise((resolve, reject) => {
    const httprequest = new XMLHttpRequest();
    httprequest.onreadystatechange = () => {
      if (httprequest.readyState === XMLHttpRequest.DONE) {
        if (httprequest.status === 200) {
          console.log(httprequest.response);

          resolve(JSON.parse(httprequest.response));
        } else {
          reject(httprequest.status);
        }
      }
    };
    httprequest.open(
      "GET",
      `http://localhost:3000/match?puuid=${puuid}&startTime=${start}&endTime=${end}`
    );
    httprequest.send();
  });
}
function eachmatch(matchid) {
  return new Promise((resolve, reject) => {
    const httprequest = new XMLHttpRequest();
    httprequest.onreadystatechange = () => {
      if (httprequest.readyState === XMLHttpRequest.DONE) {
        if (httprequest.status === 200) {
          resolve(JSON.parse(httprequest.response));
        } else {
          reject(httprequest.status);
        }
      }
    };
    httprequest.open(
      "GET",
      `http://localhost:3000/matchdata?matchid=${matchid}`
    );
    httprequest.send();
  });
}

function search() {
  match()
    .then(async (response) => {
      const matchBox = document.querySelector(".matchBox");

      matchBox.innerHTML = "";
      if (response.length == 0) {
        matchBox.innerHTML = `<h1>경기 기록이 존재하지 않습니다 </h1>`;
      }
      for (let match in response) {
        const each = await eachmatch(response[match]);
        const EachMatch = document.createElement("div");
        EachMatch.className = "eachMatch";
        console.log(each);
        const Win = document.createElement("table");
        Win.className = "Win";
        const Lose = document.createElement("table");
        Lose.className = "Lose";
        const winheader = document.createElement("thead");
        winheader.innerHTML =
          "<th style='color:#5383E8; font-size:30px'>승리</th><th>소환사명</th><th>포지션</th><th>KDA</th><th>적에게 가한 피해량</th><th>CS</th><th>아이템</th>";
        const loseheader = document.createElement("thead");
        loseheader.innerHTML =
          "<th style='color:#E84057;font-size:30px'>패배</th><th>소환사명</th><th>포지션</th><th>KDA</th><th>적에게 가한 피해량</th><th>CS</th><th>아이템</th>";
        Win.appendChild(winheader);
        Lose.appendChild(loseheader);
        const winbody = document.createElement("tbody");
        const losebody = document.createElement("tbody");

        //개별 유저 정보
        for (let player in each.info.participants) {
          const participant = document.createElement("tr");
          participant.className = "participant";
          const data = each.info.participants[player];
          participant.innerHTML = `
        <td><div style="position:relative"><img width="50px" src="https://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/${data.championName}.png"/><div class="level">${data.champLevel}</div></div></td>
        <td>${data.summonerName}</td>
        <td>${each.info.participants[player].individualPosition}</td>
        <td>${data.kills}/${data.assists}/${data.deaths}</td>
        <td>${data.totalDamageDealtToChampions}</td>
        <td>${data.totalMinionsKilled}</td>
        `;
          const item = document.createElement("td");
          item.className = "item";
          const items = [
            data.item0,
            data.item1,
            data.item2,
            data.item3,
            data.item4,
            data.item5,
            data.item6,
          ];
          for (let i = 0; i < 7; i++) {
            const eachitem = document.createElement("img");
            if (items[i] != 0) {
              eachitem.setAttribute(
                "src",
                `http://ddragon.leagueoflegends.com/cdn/12.9.1/img/item/${items[i]}.png`
              );
            }
            item.appendChild(eachitem);
          }
          //검색 유저결과는 백그라운드 컬러 진하게
          if (
            data.summonerName ==
            document.querySelector(".summonerName").textContent
          ) {
            if (data.win) {
              participant.style.backgroundColor = "#5383E8";
            } else {
              participant.style.backgroundColor = "#E84057";
            }
          }
          participant.appendChild(item);
          if (data.win) {
            winbody.appendChild(participant);
          } else {
            losebody.appendChild(participant);
          }
        }

        //게임 종합 결과
        const middledata = document.createElement("div");
        middledata.className = "middledata";
        middledata.innerHTML = `<div>플레이시간:${Math.floor(
          each.info.gameDuration / 60
        )}분</div>`;
        const windata = document.createElement("div");
        windata.className = "windata";
        const losedata = document.createElement("div");
        losedata.className = "losedata";
        for (let team in each.info.teams) {
          if (each.info.teams[team].win) {
            windata.innerHTML = `<div>바론:${each.info.teams[team].objectives.baron.kills}킬</div><div>드래곤:${each.info.teams[team].objectives.dragon.kills}킬</div><div>포탑 철거:${each.info.teams[team].objectives.tower.kills}`;
          } else {
            losedata.innerHTML = `<div>바론:${each.info.teams[team].objectives.baron.kills}킬</div><div>드래곤:${each.info.teams[team].objectives.dragon.kills}킬</div><div>포탑 철거:${each.info.teams[team].objectives.tower.kills}`;
          }
        }
        middledata.appendChild(windata);
        middledata.appendChild(losedata);

        Win.appendChild(winbody);
        Lose.appendChild(losebody);
        EachMatch.appendChild(Win);
        EachMatch.appendChild(middledata);
        EachMatch.appendChild(Lose);
        matchBox.appendChild(EachMatch);
      }
    })
    .catch((err) => {
      alert(err);
    });
}
