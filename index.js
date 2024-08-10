import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Routes from './routes/route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json({ limit: '10mb' }));
app.use(cors());

console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Connection error', error);
  });

  app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`);
})



//     "multer": "^1.4.5-lts.1",
//     "path": "^0.12.7"

// # MONGODB_URI = "mongodb+srv://nadeem:nadeem3658@cluster0.eqcs46i.mongodb.net/Sylani-ClassRoom?retryWrites=true&w=majority"

// # npm outdated 

// Check your Internet connection
// Check any cables and reboot any routers, modems, or other network devices you may be using.
// Allow Chrome to access the network in your firewall or antivirus settings.
// If it is already listed as a program allowed to access the network, try removing it from the list and adding it again.
// If you use a proxy server…
// Check your proxy settings or contact your network administrator to make sure the proxy server is working. If you don't believe you should be using a proxy server: Go to the Chrome menu > Settings > Show advanced settings… > Change proxy settings… > LAN Settings and deselect "Use a proxy server for your LAN".