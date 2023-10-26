# Terms-of-Service-Explainer
A small web extension to summarize and redline terms and conditions on a webpage, with the idea coming from [this post](https://www.threads.net/@lessin/post/CxdpzGlv074/?igshid=MzRlODBiNWFlZA==) on Threads by user `lessin`.
## Some Thoughts
Built this to try out the OpenAI API and learn how to make a Chrome extension along the way. Heavily leaned into using ChatGPT as a tool to generate code, learn the required web development knowledge, as well as help with debugging - and it worked great (even generating the prompt we give it through the OpenAI API)! Here's the [chat log](https://chat.openai.com/share/d9423dac-ed08-446e-913d-39f19ffbe9cf
) of my interaction with ChatGPT as I built this. And here's another [chat log](https://chat.openai.com/share/a8a43e41-d21a-45f7-a151-a0ff2d306753) from when I updated it to include chunking the text into multiple queries to process long terms and conditions.
## Trying Out the Extension
To try it out, do the following:
1. Download the git repo
2. Download NodeJS so that you can host the server code locally.
3. Make sure you have your OpenAI key as an environment variable (as well as a paid plan) since you will need access to the API.
4. Run `node server.js` to start the server on port 3000.
5. [Load the `tos-grabber` sub-directory as a Chrome extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
6. Navigate to a site with terms and conditions - open the extension, and click the "Evaluate ToS" button to get the summary.
## Example
<img width="1202" alt="Screen Shot 2023-10-25 at 9 50 54 PM" src="https://github.com/ramvenkat98/Terms-of-Service-Explainer/assets/27733966/233f36a8-081d-4b3a-a219-e1feb7e3c3bb">
## Some of the Many Things that Can Be Improved
1. When you click the button, it should say that the text is loading, instead of saying nothing until we receive the response, since the response can take some time (~3 minutes or so) to generate especially for longer webpages.
2. The pop-up shouldn't auto-close without retaining the summary and flagged terms when we click on a part of the webpage outside of the pop-up; even if it does close, we should save that summary so that the next time the extension is opened it can be re-accessed.
3. The final prompt to summarize the individual chunks can probably be improved, the final summary is sometimes pretty lengthy and not concise enough. The chunking can be improved too - it's quite arbitrary now and probably very conservative - we could increase the size of each chunk so that the speed of generation increases.
4. Needs some proper error handling.
