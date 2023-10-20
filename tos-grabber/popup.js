
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
    console.log(responseData.responseData.receivedData);
    const text = responseData.responseData.receivedData.split("\n").join("<br />");
    console.log(text);
    document.getElementById('results').innerHTML = text;
    // sendResponse({message: "Popup script received the message"});
    /* chrome.runtime.sendMessage(
        {type: "response", data: responseData, function(response){
            console.log(response.message);
        }}
    ); */
  });
}

const button = document.querySelector("button");
button.addEventListener("click", async () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const activeTab = tabs[0];
     chrome.scripting.executeScript({
        target: {tabId: activeTab.id},
        files: ['content-script.js']
    }, ([result] = []) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
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
});

/*
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.type === "response") {
        const responseData = message.data;
        // Update the popup HTML with the response data
        document.getElementById('results').innerText = JSON.stringify(responseData, null, 2);
        sendResponse({message: "Popup script received the message"});
    }
});
*/

console.log("Entered popup.js\n");
