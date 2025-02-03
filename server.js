require('dotenv').config();
const fetch = require("node-fetch");

const express = require('express');
cors = require('cors');

const {
    PORT,
    API_KEY,
    PROXY_URL,
    API_URL
} = process.env

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


app.get('/api/v1/similar_tastes/', (req, res) => {
    const taste = req.query.q;
    const type = req.query.type;
    console.log('req: ', taste);

    (async()=>{
        const PROXY_URLParameters = new URLSearchParams();
        const API_URLParameters = new URLSearchParams();
        API_URLParameters.set("info", 1);
        API_URLParameters.set("limit", 6);
        API_URLParameters.set("k", API_KEY);
        API_URLParameters.set("q", taste );
        API_URLParameters.set("type", type);

        const FULL_API_URL = `${API_URL}${API_URLParameters.toString()}`;
        console.log('FULL_API_URL', FULL_API_URL);
        
        PROXY_URLParameters.set('url', FULL_API_URL);
        const fullURL = `${PROXY_URL}${PROXY_URLParameters.toString()}`;
        console.log('fullURL:', fullURL);
        try {
            const response = await fetch(fullURL,
                {headers: {
                    'Access-Control-Allow-Origin': '*'
                    }});
            if (response.ok) {
                const data = await response.json();
                data.contents = JSON.parse(data.contents); // For some reason we have to do this twice 
                console.log('data', data.contents);
                res.status(200).json(data.contents);
                } else {
                res.status(404).send(data.contents);
                }
            } catch (err) {
                console.log(err.message);
            }
    })();
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
};
app.listen( port, () => {
    console.log(`Listening on port ${port}`)
});