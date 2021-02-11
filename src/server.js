import express from "express"
import bodyParser from "body-parser"
import { MongoClient } from 'mongodb';
import path from 'path'

const app = express();
app.use(express.static(path.join(__dirname, 'build')))
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

const withDB = async (operations, res) => {
	try {
        
        const uri = "mongodb+srv://jacinto:" + encodeURIComponent("D4VkaYik#lG5") + "@toilets-au.kbefj.mongodb.net/test?retryWrites=true&w=majority";
        const client = await MongoClient.connect(uri, { useNewUrlParser: true });
        const db = client.db('test')

        await operations(db)
        
        client.close()
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "something went wrong", err })
    }
}


app.get('/api/articles/:name', async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection('test').findOne({ name: articleName })
        res.status(200).json(articleInfo);
        console.log(articleInfo)
    }, res)
})

app.post("/api/articles/:name/upvote", async (req, res) => {
    withDB(async (db) => {
    
        const articleName = req.params.name; 
        const articleInfo = await db.collection('test').findOne({ name: articleName })
        const testing = await db.collection('test').updateOne({ name: articleName },
            {
                '$set': {
                    upvotes: articleInfo.upvotes + 1,
                }
            }
        );    
        const updatedArticleInfo = await db.collection('test').findOne({ name: articleName })
        res.status(200).json(updatedArticleInfo);
    }, res)
})

app.post("/api/articles/:name/add-comment", (req, res) => {
    withDB(async (db) => {
    
        const { username, text } = req.body
        const articleName = req.params.name;

        const articleInfo = await db.collection('test').findOne({ name: articleName })
        const testing = await db.collection('test').updateOne({ name: articleName },
            {
                '$set': {
                    comments: articleInfo.comments.concat({username, text})
                }
            }
        );    
        const updatedArticleInfo = await db.collection('test').findOne({ name: articleName })
        res.status(200).json(updatedArticleInfo);
    }, res)
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'))
})

app.listen(8000, () => console.log("listening on port 8000"))