const mongoose=require('mongoose');                //Imports the Mongoose library for MongoDB object modeling
const URLSchema= new mongoose.Schema({             //Creates a new Mongoose schema object that defines the structure for URL document  
    shortId:{                                      //Unique string identifier for the shortened URL (required, must be unique
        type:String,
        required:true,
        unique:true
    },
    redirectURL:{                                 //The original long URL to redirect to (required string)
        type:String,
        required:true
    },
    visitHistory:[{ timestamp:{ type:Number } }], //Array of visit records, each containing a timestamp indicating when the shortened URL was accessed

},
{ timestamps:true }
);

const URL= mongoose.model('URL',URLSchema);       //Creates and assigns the model to the URL constant, registering it with the collection name "URL"
module.exports= URL;