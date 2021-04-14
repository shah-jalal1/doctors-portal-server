const express = require('express')
const app = express()
const boyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.owenr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const port = 5000

app.use(cors());
app.use(boyParser.json());
app.use(express.static('doctors'));
app.use(fileUpload());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortal").collection("appointments");
    console.log("database connectd");

    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        // console.log(appointment);
        appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/appointments', (req, res) => {
        appointmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addAppointmentsByDate', (req, res) => {
        const date = req.body;
        console.log(date.date);
        appointmentCollection.find({date: date.date}) 
        .toArray((err, document)  => {
            res.send(document)
        })
    });

    app.post('/addADoctor', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        console.log(name, email, file);
    })

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port);