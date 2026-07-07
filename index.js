const express= require('express');
const path= require('path');

const {connectToMongoDB}= require('./connect');
const urlRoutes= require('./routes/url');
const URL= require('./models/url');


connectToMongoDB(process.env.MONGO_URL || "mongodb://localhost:27017/URLShortener")
.then(()=> console.log("Connected to MongoDB"))
.catch((err)=> console.error("MongoDB connection failed:", err));

const app= express();
const port= process.env.PORT || 8001;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use("/url",urlRoutes);

app.get('/:shortId',async (req,res)=>{
    const shortId=req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } }
    );

    if (!entry) return res.status(404).json({ error: 'Short URL not found' });

    res.redirect(entry.redirectURL); // Redirect to the original URL

    // Implementation for handling short ID lookup
});
app.listen(port ,()=> console.log(`Server is running on PORT: ${port}`))
