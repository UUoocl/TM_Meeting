   
    async function getSheetData() {
      console.log("fetching sheet data: ");
      
      const paramsString = window.location.search;
      const searchParams = new URLSearchParams(paramsString);
      
      let SHEET_ID = searchParams.get("sheetID");
      let SHEET_TITLE = searchParams.get("sheetName");
      let SHEET_RANGE = searchParams.get("sheetRange");
      let sheetData;
      let cellsContent;
      let FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;
      await fetchData();
      
      async function fetchData() {
        fetch(FULL_URL)
        .then((res) => res.text())
        .then( async (rep) => {
          sheetData = JSON.parse(rep.substring(47).slice(0, -2));
          console.log("fetched:", sheetData)
          data = await sheetDataToObject(sheetData.table);
          
          const headers = sheetData.table.cols.map(obj => obj['label']);
          //return data to the main script
          loadData(headers, data);
        });
      }
    }
        
    //make an Array of objects from the Google Sheets Data
    //the google sheet data is returned in columns and rows 
    //columns in the range are keys and 
    //rows are values
    async function sheetDataToObject(sheetData) {
      if(typeof sheetData === 'object'){
        const keys = sheetData.cols;
        const values = [];
        for (let i = 0; i < sheetData.rows.length; i++) {
          const rowValues = sheetData.rows[i]
          const obj = {};
          for (let j = 0; j < keys.length; j++) {  
            if(!(Object.is(rowValues.c[j], null))){
              obj[keys[j].label] = rowValues.c[j].v;
            }
          }
          values.push(obj)
        }
        return values;
      }
    }
        
    //make an Array of objects from the Google Sheets Data Rows 
    //if the data is only in the rows of the fetched table 
    //row 1 in the range are keys and 
    //row 2+ are values
    function sheetRowsToObject(arr) {
      if(Array.isArray(arr)){
        const keys = arr[0].c;
        const slides = [];
        for (let i = 0; i < arr.length; i++) {
          const values = arr[i].c
          const obj = {};
          for (let j = 0; j < keys.length; j++) {
            if(!(Object.is(values[j], null))){
              obj[keys[j].v] = values[j].v;
            }
          }
          slides.push(obj)
        }
        return slides;
      }
    }