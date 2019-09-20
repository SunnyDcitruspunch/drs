const express = require('express')
const bodyParser = require('body-parser')
const pdf = require('html-pdf')
const cors = require('cors')

const pdfSchedule = require('./documents/index')

const pdfDepartment = require('./documents/departments')

const app = express();

const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//create drs pdf
app.post('/create-schedule', (req, res) => {
    //create drs pdf
    pdf.create(pdfSchedule(req.body), {}).toFile('result.pdf', (err) => {
        if(err){
            res.send(Promise.reject())
        }

        res.send(Promise.resolve())
    })
})

//create delete common records departments pdf
app.post('/create-departments', (req, res) => {
    pdf.create(pdfDepartment(req.body), {}).toFile('result.pdf', (err) => {
        if (err) {
            res.send(Promise.reject())
        }

        res.send(Promise.resolve())
    })
})

app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/result.pdf`)
})

app.listen(port, () => console.log(`Listening on port ${port}`))