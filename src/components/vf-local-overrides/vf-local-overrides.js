console.log('in overrides..');
// vf-local-overrides

// Don't need JS? Then feel free to delete this file.

/*
* A note on the Visual Framework and JavaScript:
* The VF is primairly a CSS framework so we've included only a minimal amount
* of JS in components and it's fully optional (just remove the JavaScript selectors
  * i.e. `data-vf-js-tabs`). So if you'd rather use Angular or Bootstrap for your
  * tabs, the Visual Framework won't get in the way.
  *
  * When querying the DOM for elements that should be acted on:
  * 🚫 Don't: const tabs = document.querySelectorAll('.vf-tabs');
  * ✅ Do:    const tabs = document.querySelectorAll('[data-vf-js-tabs]');
  *
  * This allows users who would prefer not to have this JS engange on an element
  * to drop `data-vf-js-component` and still maintain CSS styling.
  */

 // // if you need to import any other components' JS to use here
 // import { vfOthercomponent } from 'vf-other-component/vf-other-component';

 /**
  * The global function for this component
  * @example vfcomponentName(firstPassedVar)
  * @param {string} [firstPassedVar]  - An option to be passed
  */
 function vfLocalOverrides(firstPassedVar) {
   firstPassedVar = firstPassedVar || 'defaultVal';
   console.log('vfLocalOverrides invoked with a value of', firstPassedVar);
}

/* Parses and returns data in following format
    returned data will look like this
    [{
      contribution_date: "11/07/2018"
      contributor_name: "Example User 1"
      contributor_profile_link: "https://www.biography.com/business-figure/elon-musk"
    },{
      contribution_date: "11/09/2018"
      contributor_name: "Example User 2"
      contributor_profile_link: "https://www.biography.com/business-figure/elon-musk"
    }]
 */

const HALL_OF_FAME_SPREADSHEET_URL = "https://spreadsheets.google.com/feeds/cells/1PzqB89rAN-mg0dWpiXw7cBuETNjPz3IYdTXXsph_9Ig/1/public/full?alt=json";

async function getHallOfFameContributors(){
  return await fetch(HALL_OF_FAME_SPREADSHEET_URL)
    .then((data) => data.json())
    .then(result => parseGoogleSheetResult(result, 3));
}


const parseGoogleSheetResult = (response, columnCount = 1) => {
  if (!response?.feed?.entry || columnCount <= 0) {
    throw new Error("Incorrect input to function!");
  }

  const entries = response.feed.entry;
  const normalizedDataList = entries.map((item) => item?.gs$cell?.inputValue);

  const headers = normalizedDataList.slice(0, columnCount); // first columnCount items are headers
  const dataItems = normalizedDataList.splice(columnCount); // remaining items are data items

  //get array chunks - that means, a row of data that has column count of columnCount
  const dataRows = [...arrayChunks(dataItems, columnCount)];

  //build sensible json structure out of all the above data
  const jsonData = dataRows.map((rowAsArray) => {
    const o = {};
    for (let i = 0;i < headers.length;i++) {
      o[headers[i]] = rowAsArray[i];
    }
    return o;
  });

  return jsonData;
};

/* generator to generator array chunks */
function* arrayChunks(array, chunkSize) {
  for (let i = 0;i < array.length;i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}




// // If you need to invoke the component by default
// vfLocalOverrides();

// By default your component should be usable with js imports
// export { vfLocalOverrides, getHallOfFameContributors };
//
// // You should also import it at ./components/vf-core/scripts.js
// // import { vfcomponentName } from '../components/raw/vf-component/vf-component.js';
// // And, if needed, invoke it
// // vfcomponentName();
