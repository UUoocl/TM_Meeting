window.addEventListener("startVDO", async (event) => {
  console.log("starting VDO connection")
  await openConnection();  

  iframe = document.getElementById("vdoIframe");
  
  window.addEventListener( "message", function( event ) {
    //if iframe
    if (event.source !== iframe.contentWindow) {
      console.log("non vdo event",event)
      return
    } // reject messages send from other iframes
    else{
      if(event.data.hasOwnProperty('gotChat')){
        console.log("vdo event",event)
        vdoMessage(event.data.gotChat)
      }
    }
  });

  //debug test message
  let button = document.createElement("button");
  button.id = "vdoChatButton";
  button.innerHTML = "Say Hello";
  button.onclick = () => {
    console.log("button pressed", iframe)
    iframe.contentWindow.postMessage({"sendChat": JSON.stringify({"from receiver1": "label?","item2" : "more cool"})}, '*');
    //iframe.contentWindow.postMessage({"sendData": JSON.stringify({"Data Out": "Data value"})}, '*');
  };

  document.getElementById("slide 0").appendChild(button);
},{once:true});

async function openConnection(){
  const paramsString = window.location.search;
  const searchParams = new URLSearchParams(paramsString);

  let VDO_ID = searchParams.get("vdoID");
  let VDO_PW = searchParams.get("vdoPW");
  let FULL_URL = `https://vdo.ninja/?label=Host&datamode&push=${VDO_ID}&pw=${VDO_PW}&mv=2`;
  
  // Embedding VDO.Ninja iframe for sending commands
  // document.getElementById("slide 0").innerHTML =`<iframe id="vdoIframe" 
  //   src=${FULL_URL} name="vdoIframe" style="width:200px; height:200px" ></iframe>`;
  document.body.insertAdjacentHTML('beforeend', `<iframe id="vdoIframe" 
    src=${FULL_URL} name="vdoIframe" style="display: none"></iframe>`);
  Reveal.next();
  Reveal.slide(0);

  return; 
}
