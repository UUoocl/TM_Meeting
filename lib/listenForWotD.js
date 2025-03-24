//Get Word of the day
async function fetchWotD() {
  let SHEET_ID = "1Y6rf5088z-P32AFcx_powupp6HnIa9UWz3XsXZHkbv8";
  let SHEET_TITLE = "Agenda";
  let SHEET_RANGE = "F1:J2";
  let data;
  let FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

  console.log("fetch word");

  await fetch(
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=K2:K2`
  )
    .then((res) => res.text())
    .then((rep) => {
      data = JSON.parse(rep.substr(47).slice(0, -2));
      console.log(data);

      const word = data.table.rows[0].c[0].v;
      console.log("word: ", word);
      obs.call("SetInputSettings", {
        inputName: "Word of the Day",
        inputSettings: {
          text: word,
        },
      });
    });
}

async function getWotD() {
  const WotD = await obs.call("GetInputSettings", {
    inputName: "Word of the Day",
  });
  console.log("WotD", WotD);
  t = WotD.inputSettings.text;
}

obs.on("InputSettingsChanged", async function (event) {
  //if LocalVocal Subtitle changed
  if (event.inputName === "LocalVocal Subtitles") {
    //if the text contains the Word of the Day
    if (event.inputSettings.text.toLowerCase().includes(t)) {
      await obs
        .call("SetSceneItemEnabled", {
          sceneName: "Input Voice to Text",
          sceneItemId: 2,
          sceneItemEnabled: true,
        })
        .then(
          setTimeout(async () => {
            obs.call("SetSceneItemEnabled", {
              sceneName: "Input Voice to Text",
              sceneItemId: 2,
              sceneItemEnabled: false,
            });
          }, 5000)
        );
    }
  }
});

function loadScript(script, module) {
  const scriptElem = document.createElement("script");
  scriptElem.src = `${script}`;
  //scriptElem.async = script.async;
  if (module) {
    scriptElem.type = "module";
  } else {
    scriptElem.type = "text/javascript";
  }
  scriptElem.onload = () => {
    console.log(`${script} Script loaded successfully`);
  };
  scriptElem.onerror = () => {
    console.log(`${script} Error occurred while loading script`);
  };
  document.body.appendChild(scriptElem);
}
