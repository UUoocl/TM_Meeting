
async function connectOBS(wssDetails) {

  //connect to OBS web socket server
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
      `ws://${wssDetails.IP}:${wssDetails.PORT}`,
      wssDetails.PW,
      {
        rpcVersion: 1,
      }
    );
    console.log(
      `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
    );
  } catch (error) {
    console.error("Failed to connect", error.code, error.message);
    document.getElementById("WSconnectButton").style.background = "#ff0000";
  }
  obs.on("error", (err) => {
    console.error("Socket error:", err);
  });
  console.log(`ws://${wssDetails.IP}:${wssDetails.PORT}`);

  //return obs;
}
