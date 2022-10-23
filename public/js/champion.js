const httprequest = new XMLHttpRequest();
httprequest.onreadystatechange = () => {
  if (httprequest.readyState === XMLHttpRequest.DONE) {
    if (httprequest.status === 200) {
      var result = JSON.parse(httprequest.response).data;
      const Container = document.createElement("div");
      Container.className = "container";
      for (const champion in result) {
        const element = document.createElement("div");
        element.className = "ChampionBox";
        element.innerHTML = `<div class="ChampTitle">${result[champion].name}</div>
        <img src="https://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/${result[champion].image.full}"></img>
        <div class="Chamblurb">${result[champion].blurb}</div>
        <button type="button" onclick="location.href='/championdetail.html?name=${champion}';">더보기</button>`;
        Container.appendChild(element);
        document.body.appendChild(Container);
      }
      const footer = document.createElement("footer");
      footer.innerHTML = `<p>&copy;made by dongyeop</p>`;
      document.body.appendChild(footer);
    } else {
      alert("Request Error!");
    }
  }
};
httprequest.open(
  "GET",
  "http://ddragon.leagueoflegends.com/cdn/12.9.1/data/ko_KR/champion.json"
);
httprequest.send();
