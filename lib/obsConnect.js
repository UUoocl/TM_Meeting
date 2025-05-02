const obs = new OBSWebSocket();
obs.status = "none"
//get web socket details from a message
window.addEventListener(`ws-details`, async function (event) {
  //event wss details
  console.log("message received: ", event)
  await connectOBS(event.detail.wssDetails);
})

async function connectOBS(wssDetails) {
  //connect to OBS web socket server
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = 
    await obs.connect(`ws://${wssDetails.IP}:${wssDetails.PORT}`,wssDetails.PW,{rpcVersion: 1,});
    console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`);
    return "connected";
  } catch (error) {
    console.error("Failed to connect", error.code, error.message);
    return "failed";
  }
  //console.log(`ws://${wssDetails.IP}:${wssDetails.PORT}`);
}

obs.on('ConnectionOpened', () => {
  console.log('Connection to OBS WebSocket successfully opened');
  obs.status = "connected";
});

obs.on('ConnectionClosed', () => {
  console.log('Connection to OBS WebSocket closed');
  obs.status = "disconnected";
});

obs.on('ConnectionError', err => {
  console.error('Connection to OBS WebSocket failed', err);
});

obs.on('Identified', data => {
  console.log('OBS WebSocket successfully identified', data);
});


obs.on("error", (err) => {
  console.error("Socket error:", err);
});
