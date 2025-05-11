let SHEET_ID, SHEET_TITLE, SHEET_RANGE, FULL_URL; 
let  data,currentData, currentBG;

if(localStorage.getItem("sheetID")){
    document.getElementById("sheetID").value = localStorage.getItem("sheetID");
    document.getElementById("sheetName").value = localStorage.getItem("sheetName");
    document.getElementById("sheetRange").value = localStorage.getItem("sheetRange");  
    

function sheetsConnect() {
    console.log("Sheets function")
    let sheetsDetails ={
        SHEET_ID: document.getElementById("sheetID").value,
        SHEET_TITLE: document.getElementById("sheetName").value,
        SHEET_RANGE: document.getElementById("sheetRange").value
    }

  //Save Google sheet values to local storage
  localStorage.setItem("sheetID", sheetsDetails.SHEET_ID);
  localStorage.setItem("sheetName", sheetsDetails.SHEET_TITLE);
  localStorage.setItem("sheetRange", sheetsDetails.SHEET_RANGE);

  FULL_URL = `https://docs.google.com/spreadsheets/d/${sheetsDetails.SHEET_ID}/gviz/tq?sheet=${sheetsDetails.SHEET_TITLE}&range=${sheetsDetails.SHEET_RANGE}`;  
    sendSheetDataToOBS(sheetsDetails)
}

async function sendSheetDataToOBS(sheetsDetails){
    console.log(sheetsDetails)
    //send websocket server connection details to OBS browser source
    await obs.call("CallVendorRequest", {
        vendorName: "obs-browser",
        requestType: "emit_event",
        requestData: {
            event_name: "sheetsSlideTextLink",
            event_data: { sheetsDetails },
        },
    });
}

// async function fetchData() {
//   fetch(FULL_URL)
//     .then((res) => res.text())
//     .then((rep) => {
//       data = JSON.parse(rep.substr(47).slice(0, -2));
//       console.log(data);

//       let length = data.table.rows.length;

//       let varBGcolor = data.table.rows[1].c[3].v;
//       console.log(data.table.rows === currentData);

//       if (!(currentData === data.table.rows)) {
//         currentData = data.table.rows;
//         if (!(currentBG === varBGcolor)) {
//           currentBG = varBGcolor;
//           console.log(currentData);
//           console.log(currentBG);
//           if (varBGcolor === "White") {
//             Reveal.slide(2, 0);
//           }
//           if (varBGcolor === "Green") {
//             Reveal.slide(1, 1);
//           }
//           if (varBGcolor === "Yellow") {
//             Reveal.slide(1, 2);
//           }
//           if (varBGcolor === "Red") {
//             Reveal.slide(1, 3);
//           }
//         }
//       }

//       document.getElementById("name0").innerHTML = data.table.rows[1].c[1].v;
//       document.getElementById("section0").innerHTML = data.table.rows[1].c[0].v;
//       document.getElementById("time0").innerHTML = data.table.rows[1].c[2].v;
//       document.getElementById("details0").innerHTML = data.table.rows[1].c[4].v;

//       document.getElementById("name1").innerHTML = data.table.rows[1].c[1].v;
//       document.getElementById("section1").innerHTML = data.table.rows[1].c[0].v;
//       document.getElementById("time1").innerHTML = data.table.rows[1].c[2].v;
//       document.getElementById("details1").innerHTML = data.table.rows[1].c[4].v;

//       document.getElementById("name2").innerHTML = data.table.rows[1].c[1].v;
//       document.getElementById("section2").innerHTML = data.table.rows[1].c[0].v;
//       document.getElementById("time2").innerHTML = data.table.rows[1].c[2].v;
//       document.getElementById("details2").innerHTML = data.table.rows[1].c[4].v;

//       document.getElementById("name3").innerHTML = data.table.rows[1].c[1].v;
//       document.getElementById("section3").innerHTML = data.table.rows[1].c[0].v;
//       document.getElementById("time3").innerHTML = data.table.rows[1].c[2].v;
//       document.getElementById("details3").innerHTML = data.table.rows[1].c[4].v;
//     });
}
