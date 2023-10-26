const openai = require('openai');
const http = require('http');

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
}
const openaiInstance = new openai({apiKey: process.env.OPENAI_API_KEY});
console.log("Loaded OpenAI instance");

const CHUNK_SIZE = 8192; // adjust this based on your needs
const OVERLAP_SIZE = 800; // adjust overlap as needed

// Utility function to chunk the text with overlaps
function chunkWithOverlap(text, chunkSize, overlapSize) {
    const chunks = [];
    let index = 0;
    while (true) {
        const end = Math.min(index + chunkSize, text.length);
        chunks.push(text.slice(index, end));
        index = end - overlapSize;
        if (end == text.length) {
            break;
        }
    }
    return chunks;
}

const server = http.createServer(async function(req, res) {
  if (req.method === 'POST') {
    console.log(req.url);
    console.log("Request received!");
    let body = '';
    
    // Collect the data sent in the request
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // Once all data has been received, send a response
    req.on('end', async () => {
        const chunks = chunkWithOverlap(body, CHUNK_SIZE, OVERLAP_SIZE);
        const allResponses = [];
        console.log("Chunking done");
        // Process the first chunk to check for terms and conditions
        const initialResponse = await openaiInstance.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: [{
                role: "user",
                content: `
                    Please analyze the following HTML content, which is the start of a webpage, to identify if the webpage will contain Terms of Service or Terms and Conditions. Return a response containing "true" if it does.

                    HTML Content:
                    ${chunks[0]}
                `
            }]
        });
        console.log(chunks[0]);
        console.log("Got first response", initialResponse.choices[0].message.content.trim());
        const containsTnC = initialResponse.choices[0].message.content.trim().includes('true');
        let analysisText = "We did not find any terms and conditions on this page.\n";
        console.log("First chunk analyzed, containsTnC was", containsTnC);

        if (containsTnC) {
            const promises = chunks.map((chunk, i) => {
                console.log("Preparing analysis for chunk number", i);
                return openaiInstance.chat.completions.create({
                    model: "gpt-3.5-turbo-16k",
                    messages: [{
                        role: "user",
                        content: `
                            Please analyze the following HTML content to summarize the agreement and highlight any unusual or overly aggressive terms that the user is implicitly agreeing to.

                            HTML Content:
                            ${chunk}

                            ---

                            Summary of Agreement:
                            {summary_text}

                            Flagged Terms:
                            {flagged_terms_list}
                        `
                    }]
                }).then(response => {
                    const content = response.choices[0].message.content.trim();
                    console.log("Response for chunk", i, "was", content);
                    return content;
                });
            });

            const results = await Promise.all(promises);
            allResponses.push(...results);

            // Combining all the responses and asking the model to make a final summary
            const combinedResponses = allResponses.join(' ');
            const finalResponse = await openaiInstance.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                messages: [{
                    role: "user",
                    content: `
                        Please combine the following analysis into a coherent summary:

                        ${combinedResponses}

                        ---

                        Final Analysis:

                        Summary of Agreement:
                        {summary_text}

                        Flagged Terms:
                        {flagged_terms_list}
                    `
                }]
            });
            analysisText = finalResponse.choices[0].message.content.trim();
        }
        console.log("Final Response:");
        console.log(analysisText);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const responseData = { receivedData: analysisText };
        res.end(JSON.stringify({responseData}));
    });
  } else {
    // Handle other types of requests, like GET or requests to other URLs
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
