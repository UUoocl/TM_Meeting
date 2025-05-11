const sheetsToSlides = {
  id: "sheetsToSlides",
  init: async (reveal) => {    
    reveal.on( 'ready', event => {
      getSheetData();      
    });
    
    async function getSheetData() {
      console.log("fetching sheet data: ");
      
      const paramsString = window.location.search;
      const searchParams = new URLSearchParams(paramsString);
      
      let SHEET_ID = searchParams.get("sheetID");
      let SHEET_TITLE = searchParams.get("sheetName");
      let SHEET_RANGE = searchParams.get("sheetRange");
      let sheetData;
      let slidesContent;
      let FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;
      let currentData;
      await fetchData();
      
      async function fetchData() {
        fetch(FULL_URL)
        .then((res) => res.text())
        .then((rep) => {
          sheetData = JSON.parse(rep.substring(47).slice(0, -2));
          console.log("fetched:", sheetData)
          slidesContent = sheetDataToSlides(sheetData.table.rows);
          console.log("Slide Object",slidesContent)
          createSlides(slidesContent);
        });
      }
    }
        
    //make an Array of objects from the Google Sheets Data 
    //row 1 in the range are keys and 
    //row 2+ are values
    function sheetDataToSlides(arr) {
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
    
    async function createSlides(slidesContent){
      document.getElementById('placeholder').remove();
      
      for( let i=0; i < slidesContent.length; i++){
        // 1. Select the parent element
        const parentElement = document.getElementById('slides');
        
        // 2. Create the new element
        const newElement = document.createElement('section');
        
        // 3. Add content to the new element (optional)
        newElement.innerHTML = `<p>New list item ${i}</P>`;
        newElement.id = `slide ${i}`
        // 4. Append the new element
        parentElement.appendChild(newElement);
        reveal.next()
      }
      reveal.slide(0)
      
     console.log("slide creation complete")
     //Dispatch the start VDO event
     window.dispatchEvent(startVDO);
      return;
    }
  } 
  }