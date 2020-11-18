
const { Pool } = require('pg');



const pool = new Pool({
    connectionString: "postgres://xzykdxia:cFpExSXuaxYZYtHWsQLXaUzQUY4lJjXm@lallah.db.elephantsql.com:5432/xzykdxia"
});

// Adding some notes about the database here will be helpful for future you or other developers.
// Schema for the database can be found below:
// https://github.com/CodesmithLLC/unit-10SB-databases/blob/master/docs/images/schema.png?raw=true

// We export an object that contains a property called query,
// which is a function that returns th`e invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
const db = {
    query: async function (text, params, callback) {
        console.log('executed query', text);
        let data = await pool.query(text, params, callback);
        return data
    }
};
//controller declared here  after pool object loll. future scale would seperate but meh.
const controller = {};



controller.uploadProject = async (req, res, next) => {
    let add = req.body
    await db.query()
    next();
}
controller.loadProject = async (req, res, next) => {
    const thisId = req.query.id
    res.locals.projectBones = await.db.query()
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

module.exports = controller;