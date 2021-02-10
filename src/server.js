import express from "express"
import bodyParser from "body-parser"
import {MongoClient} from 'mongodb';

const app = express();
app.use(bodyParser.json())

const articlesInfo = {
	'learn-react': {
		upvotes: 0,
        comments: []
	},
	'learn-node': {
		upvotes: 0,
        comments: []
	},
	'my-thoughts-on-resumes': {
		upvotes: 0,
        comments: []
	}
}

// app.get("/hello", (req, res) => {
//     res.send("hello")
// })

// app.post("/hello", (req, res) => {
//     res.send(`Hello ${req.body.name}!`)
// })

// app.get('/hello/:name', (req, res) => {
//     res.send(`Hello ${req.params.name}`)
// })


app.get('/api/articles/:name', async (req, res) => {
    try {
        const articleName = req.params.name;
        const uri = "mongodb+srv://jacinto:"+encodeURIComponent("D4VkaYik#lG5")+"@toilets-au.kbefj.mongodb.net/test?retryWrites=true&w=majority";
        const client = await MongoClient.connect(uri,{ useNewUrlParser: true });
        const db = client.db('test')
        const articleInfo = await db.collection('test').findOne({name: articleName})
        res.status(200).json(articleInfo);
        console.log(articleInfo)
        client.close()
    } catch(err) {
        console.log(err)
        res.status(500).json({message: "something went wrong", err})
    }
    
})

app.post("/api/articles/:name/upvote", (req,res) => {
    const articleName = req.params.name;
    articlesInfo[articleName].upvotes += 1;
    res.status(200).send(`Article ${articleName} now has ${articlesInfo[articleName].upvotes} upvotes`)
})

app.post("/api/articles/:name/add-comment", (req,res) => {

    const {username, text } = req.body
    const articleName = req.params.name;
    articlesInfo[articleName].comments.push({username,text});
    res.status(200).send(articlesInfo[articleName])
})

app.listen(8000, () => console.log("listening on port 8000"))