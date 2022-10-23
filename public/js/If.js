const data = new URLSearchParams(window.location.search).get("name");
const httprequest = new XMLHttpRequest();
if (data == "") {
  alert("소환사명을 입력해주세요");
  history.back();
}
httprequest.onreadystatechange = () => {
  if (httprequest.readyState === XMLHttpRequest.DONE) {
    if (httprequest.status === 200) {
      var result = JSON.parse(httprequest.response).data;
      const container = document.querySelector(".Container");
      console.log(result);

      //소환사 정보
      const Summoner = document.querySelector(".Summoner");
      Summoner.innerHTML = `<img src="${result.summoner_profile_icon}"/>
      <div class="SummonerLevel">${result.summoner.level}</div><div class="SummonerNmae">${result.summoner_name}</div>`;

      //총 플레이 시간
      const PlayTime = document.querySelector(".PlayTime");
      PlayTime.innerHTML = `<h2>내가 롤을 이렇게 많이 했다니..</h2><div>총 플레이 게임<br>${
        result.total_games
      }</div><div>총 플레이 시간<br>${parseInt(
        result.total_time / 3600
      )}시간${parseInt((result.total_time % 3600) / 60)}분</div>`;

      //시즌별 랭크게임 플레이타임
      const SeasonPlaytime = document.querySelector(".SeasonPlaytime");
      try {
        console.log(result.summoner.previousTiers);
        for (let i = result.summoner.previousTiers.length - 1; i > -1; i--) {
          const EachSeason = document.createElement("div");
          EachSeason.className = "EachSeason";
          EachSeason.innerHTML = `<div>${
            result.summoner.previousTiers[i].season > 2000
              ? result.summoner.previousTiers[i].season
              : result.summoner.previousTiers[i].season + 2010
          }</div><div><img width=50 src="https:${
            result.summoner.previousTiers[i].imageUrl
          }"/><div>${result.summoner.previousTiers[i].tierDivision}</div></div>
        <div>${parseInt(result.times[i].time / 3600)}시간${parseInt(
            (result.times[i].time % 3600) / 60
          )}분</div>
        <div>${result.times[i].games}게임</div>`;
          SeasonPlaytime.appendChild(EachSeason);
        }
      } catch (err) {
        const EachSeason = document.createElement("div");
        EachSeason.innerHTML = "랭크게임 기록이 없습니다 :)";
        SeasonPlaytime.appendChild(EachSeason);
      }

      //롤을 안했더라면
      const If = document.querySelector(".If");
      If.innerHTML = `<h2>롤을 안했더라면...</h2><div class="money">${
        parseInt(result.total_time / 3600) * 9160
      }원</div><div class="book">${parseInt(
        parseInt(result.total_time / 3600) / 3
      )}권</div><div class="three">${parseInt(
        result.total_time / 180
      )}개</div><div class="move">${parseInt(
        parseInt(result.total_time / 3600) / 8
      )}번</div><div class="walk">${
        parseInt(result.total_time / 60) * 3
      }Kcal</div>`;
      const footer = document.createElement("footer");
      footer.innerHTML = `<p>&copy;made by dongyeop</p>`;
      document.body.appendChild(footer);
      const $visible = document.querySelector(".Container");
      const $loading = document.querySelector(".loading");
      $visible.style.display = "block";
      $loading.style.display = "none";
    } else {
      alert("존재하지 않는 소환사명입니다!");
      history.back();
    }
  }
};
httprequest.open("GET", `http://api.ifi.gg/search?name=${data}`);
httprequest.send();
