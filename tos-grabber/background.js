/*
function processTextWithOpenAI(text) {
  fetch('http://localhost:3000/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: text }),
  })
  .then(response => response.json())
  .then(responseData => {
    // Handle the results from OpenAI API
    console.log(responseData);
    chrome.runtime.sendMessage(
        {type: "response", data: responseData, function(response){
            console.log(response.message);
        }}
    );
  });
}

chrome.webNavigation.onCompleted.addListener(details => {
    chrome.scripting.executeScript({
        target: {tabId: details.tabId},
        files: ['content-script.js']
    }, ([result] = []) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
        // Assuming your content script sends back the extracted text as a result
        const text = result?.result;
        console.log(text);
        if (text) {
            processTextWithOpenAI(text);
        }
        else {
            console.log('No text...');
        }
    });
});
*/
