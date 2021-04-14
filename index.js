const express = require('express')
const app = express()
const boyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const { response } = require('express');
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
    const doctorCollection  = client.db("doctorsPortal").collection("doctors");
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
        const email = req.body.email;

        appointmentCollection.find({date: date.date}) 
        .toArray((err, document)  => {
            res.send(document)
        })
    });

    app.post('/addADoctor', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        doctorCollection.insertOne({ name, email, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port);