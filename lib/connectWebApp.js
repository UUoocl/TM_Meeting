document.getElementById("webAppConnectButton").addEventListener('click', async () =>{
    const wssDetails = {
        "IP": document.getElementById("IP").value,
        "PORT": document.getElementById("Port").value,
        "PW": document.getElementById("PW").value,
    };

    const URL = document.getElementById("webAppURL").value
    localStorage.setItem("webAppURL", URL);

    const parameters = `?ip=${wssDetails.IP}&port=${wssDetails.PORT}&pw=${wssDetails.PW}`
        await obs.call("GetInputSettings",{"inputName":"Browser"}),
        await obs.call("SetInputSettings",{"inputName":"Browser",
            "inputSettings":{
                "url":``
            }
        })
        
        await obs.call("SetInputSettings",{"inputName":"Browser",
            "inputSettings":{
                "url":`${URL}${parameters}`
            }
        })
     
})
