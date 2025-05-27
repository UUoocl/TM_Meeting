
const forms=[]

forms.forEach( form => deleteAllResponses(form))

function deleteAllResponses(formID) {
    const form = FormApp.openById(formID);
//   let form = FormApp.getActiveForm();
    form.deleteAllResponses();
}

//https://developers.google.com/apps-script/reference/forms/form-response
