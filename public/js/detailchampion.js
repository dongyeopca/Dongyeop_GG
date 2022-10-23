const data = new URLSearchParams(window.location.search).get("name");

const httprequest = new XMLHttpRequest();
httprequest.onreadystatechange = () => {
  if (httprequest.readyState === XMLHttpRequest.DONE) {
    if (httprequest.status === 200) {
      var result = JSON.parse(httprequest.response).data[data];
      console.log(result);
      const element = document.createElement("div");
      element.className = "ChampionBox";
      element.innerHTML = `<div class="title">${
        result.name
      }</div><div class="type">챔피언 타입:${result.tags.toString()}</div><div class="tips">챔피언 팁:${
        result.allytips
      }</div>`;

      //스킨 이미지 박스
      const skinBox = document.createElement("div");
      skinBox.className = "skinBox";
      for (let skin in result.skins) {
        let imageBox = document.createElement("div");
        imageBox.className = "imageBox";
        imageBox.innerHTML = `<img src="https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${data}_${result.skins[skin].num}.jpg">
        <div class="skinName">${result.skins[skin].name}</div>`;
        skinBox.appendChild(imageBox);
      }
      //스킬 목록
      const skillBox = document.createElement("div");
      skillBox.className = "skillBox";
      const passive = document.createElement("div");
      passive.className = "passive";
      passive.innerHTML = `<img src="http://ddragon.leagueoflegends.com/cdn/12.9.1/img/passive/${result.passive.image.full}"><div>${result.passive.name}<br/><br/>${result.passive.description}</div>`;
      skillBox.appendChild(passive);
      for (let spell in result.spells) {
        let spellBox = document.createElement("div");
        spellBox.innerHTML = `<img src="http://ddragon.leagueoflegends.com/cdn/12.9.1/img/spell/${result.spells[spell].image.full}"><div>${result.spells[spell].name}<br/><br/>${result.spells[spell].description}</div>`;
        skillBox.appendChild(spellBox);
      }
      element.appendChild(skinBox);
      element.appendChild(skillBox);

      document.body.appendChild(element);
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
  `https://ddragon.leagueoflegends.com/cdn/12.9.1/data/ko_KR/champion/${data}.json`
);
httprequest.send();
