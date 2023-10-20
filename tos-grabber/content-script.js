(function() {
    function extractText() {
        // This is a simplistic way to get all text; real-world usage might require a more nuanced approach
        return document.documentElement.outerHTML; // body.innerText;
    }

    // Execute text extraction immediately upon injection, then return the text
    return extractText();
})();

