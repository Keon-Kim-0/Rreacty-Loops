
var bodyParser = require('body-parser')
const express = require("express");
const app = express(); // making express app 
const path = require("path");
//'piano': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]





//===================================ppool time==================================
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgres://xzykdxia:cFpExSXuaxYZYtHWsQLXaUzQUY4lJjXm@lallah.db.elephantsql.com:5432/xzykdxia"
});

const db = {
    query: async function (text, params, callback) {
        console.log('executed query', text);
        let data = await pool.query(text, params, callback);
        return data
    }
};





//controller declared here  after pool object loll. future scale would seperate but meh.
const controller = {};


//-----------------translating the project for sql----------------
async function objectToArray(project) {
    return project.map(x => {
        return Object.entries(x).map(q => {
            if (q[0] === 'piano') {
                return "\'" + String(q[1].join('-')) + "\'"
            } else {
                return q[1]
            }
        })
    })
}

async function OTAwrapper(pre) {
    adjustedProject = await objectToArray(pre)
    final = await digest(adjustedProject)
    return final
}
//.replace(/["']/g, '').replace(/,\)/g, ',null)')
async function digest(arr) {                //.replace(/["']/g, '').replace(/,\)/g, ',null)')
    let str = JSON.stringify(arr).replace(/\[/g, '(').replace(/\]/g, ')').replace(/["]/g, '')
    str = str.slice(1, str.length - 1)
    return str
}

//-------------------------------------------------------------
// let test = [
// [
//     1,
//     false,
//     false,
//     true,
//     '493.88-466.16-440-415.3-392-369.99-349.23-329.63-311.13-293.66-277.18-261.63-246.94-233.08-220-207.65-196-185-174.61-164.81-155.56-146.83-138.59-130.81'
// ],
//     [
//         2,
//         true,
//         false,
//         false,
//         '493.88-466.16-440-415.3-392-369.99-349.23-329.63-311.13-293.66-277.18-261.63-246.94-233.08-220-207.65-196-185-174.61-164.81-155.56-146.83-138.59-130.81'
//     ]
// ]
// ;

controller.uploadProject = async (req, res, next) => {
    console.log('@ controller.uploadProject')
    res.locals.name = req.body.data.name
    let uploadedProject = req.body.data.project
    let uploadedName = req.body.data.name
    let uploadedBpm = req.body.data.bpm //come up with solution for this!! -.-
    // console.log('req.body^  req.query v')
    // console.log(req.query)
    //*************CALLING TRANSLATOR ABOVE */
    let sqlAddition = await OTAwrapper(uploadedProject)
    // console.log(sqlAddition.slice(0, 300))

    let sql = "INSERT INTO public." + uploadedName + " (index, kick, hihat, snare, piano) VALUES " + sqlAddition
    await db.query('DROP TABLE public.' + uploadedName, (err) => {
        if (err) {
            next();
        }
    })
    await db.query('CREATE TABLE ' + uploadedName + ' (index int, kick BOOLEAN, hihat BOOLEAN, snare BOOLEAN, piano varchar)')
    // var records = [
    //     [1, 'Yashwant', 'Chavan'],
    //     [2, 'Diwakar', 'Patil'],
    //     [3, 'Anoop', 'More']
    // ];
    await db.query(sql);
    next();
}

controller.loadProject = async (req, res, next) => {
    console.log('v query')
    let passedName = req.query.name
    res.locals.projectBones = await db.query('SELECT * FROM public.' + passedName)
    loadedProject = res.locals.projectBones.rows
    let translated = await loadTranslate(loadedProject)
    res.locals.rendered = translated
    next();
}

async function loadTranslate(arr) {
    let tired = arr.map((x, xi) => {
        let objarr = Object.entries(x)
        if (objarr[objarr.length - 1][1] === '') {
            objarr[objarr.length - 1][1] = []
        } else {
            objarr[objarr.length - 1][1] = objarr[objarr.length - 1][1].split('-').map(x => Number(x))
        }
        return Object.fromEntries(objarr)
    })
    return tired
}
/*
function createTable(instrumentNumber){

    'CREATE TABLE newProject\(\n
        column1 varchar  ,\n
        column2 varchar  ,\n
        column3 varchar  ,\n
        column4 varchar,
        column5 varchar,
        column6 varchar,
        column7 varchar,
        column8 varchar
        )'
}
*/
//==========================================================================================

function createProject(bars = 128) {
    let arr = Array(bars * 16).fill(0).map((x, xi) => {
        return {
            'index': xi, 'kick': false, 'hihat': false, 'snare': false, 'piano': []
        }
    })
    return arr
}
const newProject = createProject()


let urlencodedParser = bodyParser.urlencoded({ extended: false });
let jsonParser = bodyParser.json({ limit: '50mb' })


app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));



app.get("/YourProject", (req, res) => res.status(200).json(newProject))

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.get("/load", jsonParser, controller.loadProject, (req, res) => {
    let translated = res.locals.rendered
    res.status(200).json(translated)
})


app.post('/upload', jsonParser, controller.uploadProject, (req, res) => {
    console.log(res.locals.name + ' saved')
    res.status(200).json(res.json('Server has successfully saved your project: ' + res.locals.name))
}






);
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});


//my error handler
app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});

let port = 8080
app.listen(port, () => {
    console.log("server started on port: " + port);
});

//PORT FORWARDED!!(somethings wrong) ADDRESS AND PORT IS: http://100.2.34.50:8080/



