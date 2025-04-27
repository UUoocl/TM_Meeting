//after connecting to OBS get the Scenes and Sources
async function getScenes() {
    //create collection object
    let collection = new Object
    collection.scenes = []

    //get scenes from OBS
    const sceneList = await obs.call("GetSceneList");        
    
    //update scene object
        for(let i =0; i < sceneList.scenes.length; i++){
            //for the sources for each scene
            let sources = await obs.call("GetSceneItemList", { sceneName: sceneList.scenes[i].sceneName })
            let sourceArray =[]
            //get just the source name
            sources.sceneItems.forEach(source =>{
              console.log(source)
                sourceArray.push(source.sourceName)   
            })

            //put the scene name and source names in an object
            const sceneAndSources = new Object()
            sceneAndSources.sceneName = sceneList.scenes[i].sceneName
            sceneAndSources.sources = sourceArray

            //add the scene name and sources to the collection object
            collection.scenes.push(sceneAndSources)
        }

}
const copyButtonLabel = "Copy";

// use a class selector if available
let blocks = document.querySelectorAll("pre");

blocks.forEach((block) => {
  // only add button if browser supports Clipboard API
  if (navigator.clipboard) {
    let button = document.createElement("button");

    button.innerText = copyButtonLabel;
    block.prepend(button);

    button.addEventListener("click", async () => {
      await copyCode(block, button);
    });
  }
});

async function copyCode(block, button) {
  let code = block.querySelector("code");
  let text = code.innerText;

  await navigator.clipboard.writeText(text);

  // visual feedback that task is completed
  button.innerText = "Code Copied";

  setTimeout(() => {
    button.innerText = copyButtonLabel;
  }, 700);
}


async function refreshOBSbrowsers(){
      
  let SceneItems = await obs.call("GetSceneItemList", {
    sceneName: "rtc_target",
  });
  
  SceneItems = SceneItems.sceneItems;
  console.log(SceneItems)
  const browsers = await SceneItems.filter(async (item) => {
    console.log("item",item)
    if (item.inputKind == "browser_source") {
      await obs.call("PressInputPropertiesButton", {
        inputUuid: item.sourceUuid,
        propertyName: "refreshnocache",
      });
    }
  });
  setTimeout(connectOBS,1000)
  console.log('browser refresh complete')
}

async function sendWSSdetails() {
  const event_name = `ws-details-for-client-${rtcID}`;
  console.log("event_name",event_name, wssDetails);
  await obs.call("CallVendorRequest", {
    vendorName: "obs-browser",
    requestType: "emit_event",
    requestData: {
      event_name: event_name,
      event_data: { wssDetails },
    },
  })
    }


    async function getSceneList() {
      let sceneTable = "";
      sceneTable +=
        "<table border=1 cellpadding=3 cellspacing=0><tr><td bgcolor=#3333EE><font color=white>Enter</font></td><td bgcolor=#3333EE><font color=white>Exit</font></td></tr>";
      const sceneList = await obs.call("GetSceneList");
      sceneList.scenes.forEach((scene, index) => {
        // find scenes starting with "Scene"
        if (scene.sceneName.startsWith("scene|||")) {
          //document.getElementById("sceneList").innerHTML =
          //document.getElementById("sceneList").innerHTML + `<li class="ms-Button">${scene.sceneName}</li>`;
          const sceneName = scene.sceneName.split("|||");
          sceneTable +=
            "<tr><td>" +
            `<li class="ms-Button" data-tag-left = -355 data-tag-top = 35 data-tag-type= "scene" data-tag-event = "\\\\\\" data-tag-height = 25 data-tag-width = 340 data-tag-color = "9CD3D9" data-tag-transparency = 0 data-tag-shapeName="obs-scene\\\\\\ ${sceneName[1]}" data-tag-id="scene\\\\\\ ${sceneName[1]}" id="scene\\\\\\ ${sceneName[1]}" onclick=addTagToSlide(this)>${sceneName[1]}</li>` +
            "</td><td>" +
            `<li class="ms-Button" data-tag-left = -355 data-tag-top = 305 data-tag-type= "scene" data-tag-event = "///" data-tag-height = 25 data-tag-width = 340 data-tag-color = "FFA99B" data-tag-transparency = 0.01 data-tag-shapeName="obs-scene/// ${sceneName[1]}" data-tag-id="scene/// ${sceneName[1]}" id="scene/// ${sceneName[1]}" onclick=addTagToSlide(this)>${sceneName[1]}</li>` +
            "</td></tr>";
        }
        if (scene.sceneName === "Camera") {
          getCameraList();
        }
      });
      //addListItemClickListener();
      sceneTable += "</table>";
      document.getElementById("sceneList").innerHTML = sceneTable;
    }
    
    async function getCameraList() {
      let cameraTable = "";
      cameraTable +=
        "<table border=1 cellpadding=3 cellspacing=0><tr><td bgcolor=#3333EE><font color=white>Enter</font></td><td bgcolor=#3333EE><font color=white>Exit</font></td></tr>";
      let cameraSources = await obs.call("GetSceneItemList", { sceneName: "Camera" });
      cameraSources.sceneItems.forEach((source, index) => {
        document.getElementById("cameraList").innerHTML +=
        cameraTable +=
          "<tr><td>" +
          `<li class="ms-Button" data-tag-left = -355 data-tag-top = 65 data-tag-type= "camera" data-tag-event = "\\\\\\" data-tag-height = 25 data-tag-width = 340 data-tag-color = "9CD3D9" data-tag-transparency = 0 data-tag-shapeName="obs-camera\\\\\\ ${source.sourceName}" data-tag-id="camera\\\\\\ ${source.sourceName}" id="camera\\\\\\ ${source.sourceName}" onclick=addTagToSlide(this)>${source.sourceName}</li>` +
          "</td><td>" +
          `<li class="ms-Button" data-tag-left = -355 data-tag-top = 335 data-tag-type= "camera" data-tag-event = "///" data-tag-height = 25 data-tag-width = 340 data-tag-color = "FFA99B" data-tag-transparency = 0.01 data-tag-shapeName="obs-camera/// ${source.sourceName}" data-tag-id="camera/// ${source.sourceName}" id="camera/// ${source.sourceName}" onclick=addTagToSlide(this)>${source.sourceName}</li>` +
          "</td></tr>";
      });
      cameraTable += "</table>";
      document.getElementById("cameraList").innerHTML = cameraTable;
    }

    async function getTeleprompterSize() {
      teleprompterSize = await obs.call("GetInputSettings", {
        inputName: "Slide Notes Text"
      });
      teleprompterSize = teleprompterSize.inputSettings.font.size;
      document.getElementById("sizeValue").value = teleprompterSize;
    }
    
    async function getTeleprompterSpeed() {
      teleprompterSpeed = await obs.call("GetSourceFilter", {
        sourceName: "Slide Notes Text",
        filterName: "Scroll"
      });
      teleprompterSpeed = teleprompterSpeed.filterSettings.speed_y;
      document.getElementById("speedValue").value = teleprompterSpeed;
    }

    async function getSlideControlSceneItems() {
      controlSources = await obs.call("GetSceneItemList", { sceneName: "Slide Controls" });
    }