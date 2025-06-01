//a function to retrieve data from a google sheets spreadsheet.
//the sheets ID, Name and Range are required to fetch the data
 //the url can be passed in as a function parameter or url query parameter

    async function getSheetData(url) {

      const paramsString = window.location.search;
      const searchParams = new URLSearchParams(paramsString);
      console.log("fetching sheet data: ", url,searchParams.has("sheetID"));
      
      if(url === undefined && searchParams.has("sheetID") ===false ){
        return "no sheet ID"
      }

      let SHEET_ID, SHEET_TITLE, SHEET_RANGE, sheetData, FULL_URL;
    
      if(url ===undefined){
       SHEET_ID = searchParams.get("sheetID");
       SHEET_TITLE = searchParams.get("sheetName");
       SHEET_RANGE = searchParams.get("sheetRange");
       sheetData;
       FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;
      }
      else{FULL_URL = url}
    
      const result = await fetchData();
      
      async function fetchData() {
        fetch(FULL_URL)
        .then((res) => res.text())
        .then( async (rep) => {
          sheetData = JSON.parse(rep.substring(47).slice(0, -2));
          console.log("fetched:", sheetData)
          const tableData = await sheetDataToObject(sheetData.table);
          
          const headers = sheetData.table.cols.map(obj => obj['label']);
          //return data to the main script
          loadData(headers, tableData);
          console.log("hi")
        });
      }
      console.log("main", result)
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