# Terms-of-Service-Explainer
A small web extension to summarize and redline terms and conditions on a webpage, with the idea coming from [this post](https://www.threads.net/@lessin/post/CxdpzGlv074/?igshid=MzRlODBiNWFlZA==) on Threads by user `lessin`.
## Some Thoughts
Built this to try out the OpenAI API and learn how to make a Chrome extension along the way. Heavily leaned into using ChatGPT as a tool to generate code and learn the required web development knowledge along the way, and it worked great (even generating the prompt we give it through the OpenAI API)! here's the [chat log](https://chat.openai.com/share/d9423dac-ed08-446e-913d-39f19ffbe9cf
) of my interaction with ChatGPT as I built this. 
## Trying Out the Extension
To try it out, do the following:
1. Download the git repo
2. Download NodeJS so that you can host the server code locally.
3. Make sure you have your OpenAI key as an environment variable (as well as a paid plan) since you will need access to the API.
4. Run `node server.js` to start the server on port 3000.
5. [Load the `tos-grabber` sub-directory as a Chrome extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
6. Navigate to a site with (short) terms and conditions - open the extension, and click the "Evaluate ToS" button to get the summary.
## Example
![image](https://github.com/ramvenkat98/Terms-of-Service-Explainer/assets/27733966/747d8a11-01a6-4987-9291-5eae870789be)
## Some of the Many Things that Can Be Improved
1. The context length limit (<16k) makes it not possible to do this for most terms and conditions since they are longer. We could do some simple prompt chaining to get around this.
2. Needs some proper error handling.
3. When you click the button, it should say that the text is loading, instead of saying nothing until we receive the response.
