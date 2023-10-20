const openai = require('openai');
const http = require('http');

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
}
const openaiInstance = new openai({apiKey: process.env.OPENAI_API_KEY});
console.log("Loaded OpenAI instance");

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
            const gptResponse = await openaiInstance.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                messages: [{
                    role: "user",
                    content: `
        Please analyze the following HTML content to identify if it contains Terms of Service or Terms and Conditions. If found, summarize the agreement, highlighting any unusual or overly aggressive terms that the user is implicitly agreeing to.

        HTML Content:
        ${body}

        ---

        Analysis:

        Contains Terms and Conditions: {yes_or_no}

        Summary of Agreement:
        {summary_text}

        Flagged Terms:
        {flagged_terms_list}
        `}]
            });
      const analysisText = gptResponse.choices[0].message.content.trim();
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
