# CSC Project Stage I
After having setup the repository and received approval for our project, we must will begin development of a proof of concept to complete stage I.
*Note: staging like this can be likened to a sprint in the agile methodolgy, although usually scrum have more frequent meetings.*

To be able to run the code, you can clone the github like normal and go through the process of installing dependencies and running the code yourself or you can install docker

the command `docker-compose up -d` will run a detached process starting the backend
`npm install` and `npm start` will start up the front end (assuming you have `node.js` installed).
I wasn't able to dockerize the frontend, but if you have a way of doing that, it would make things smoother.

### __Li__
*Focus: front end development*
Task(s)
- Li will begin development of the react webapp and as proof of concept create an app that supports drag and drop of 3+ shapes.
- Everytime that a shape is added, there will be some event fired / way of capturing that event and give a feedback (for now, this can be as simple as a `console.log`)
### __Theo__
*Focus: back end support*
Task(s)
- Theo will work on developing a system to take a list of SQL keywords (SELECT FROM WHERE, to start) and make the actual queries behind that
- Theo will add a dummy dataset for the purpose of testing.
### __Sean__
*Focus: natural language processisng*
Task(s)
- Create a dummy dataset (or find it) https://www.kaggle.com/ is fine.
- Create 10+ queries, all having conditionals (ie. Where x > y), at least 3 joining tables in some way, in natural language and 
    - an example would be: what is the total number of eliminations I have in valorant when I was playing skye (if you dont understand this, its valorant where skye is a character)
- Start to feel out responses from chat gpt and decide on the format the responses should be that would be usuable for creating a database CRUD call.
- Come up with a way that will be foolproof to convert SQL flavours.