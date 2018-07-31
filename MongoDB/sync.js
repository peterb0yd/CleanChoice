const mongodb = require('mongodb')
const assert = require('assert')
const mysql = require('mysql')
const omit = require('lodash.omit')
const map = require('lodash.map')
const mapkeys = require('lodash.mapkeys')

// WARNING: you must have a SQL database named 'cleanchoice'
// populated with the data in the SQL folder before this will work

const syncSqlData = (mongoDB) => {
  return new Promise(async (resolve, reject) => {
    // Initialize DB connection
    const connection = mysql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'password',
      database: 'cleanchoice'
    })
    // Connect to DB
    connection.connect(async (err) => {
      if (err) throw err

      try {
        let query

        // Get CustomerAccounts data from SQL tables
        // NOTE: so sorry for the long-ass sql query. It's gross I know.
        // NOTE: by converting to camelcase, the query is shortened, but
        // it comes at the cost of requiring the extra module 'mapkeys'
        // and an additional function to handle it.
        query = `
          select
            c.full_name name, c.service_address, c.phone, c.email,
            c.electricity_utility, c.account_number, cs.status_name status
          from customer_accounts c
            join customer_statuses cs
              on c.status_id = cs.id
          group by c.id
        `
        await populateCollection(connection, query, mongoDB, 'customerAccounts')

        // Get EnrollmentAttempts data from SQL tables
        // NOTE: this sql query is a little better at least...
        query = `
          select
            e.customer_id, m.channel_name marketing_channel, e.date_recorded
          from enrollment_attempts e
            join marketing_channels m
		          on e.marketing_channel_id = m.id
          group by e.id
        `
        await populateCollection(connection, query, mongoDB, 'enrollmentAttempts')

        // Used for debugging
        const collections = await mongoDB.listCollections().toArray()
        const accounts = await mongoDB.collection('customerAccounts').find().toArray()
        const attempts = await mongoDB.collection('enrollmentAttempts').find().toArray()
        console.log(collections)
        console.log(accounts)
        console.log(attempts)

      } catch (e) {
        reject(e)
      } finally {
        connection.end()
        resolve()
      }
    })

  }).catch(e => {
    reject(e)
  })
}

const start = async () => {
  // Mongo Connection URL
  const url = 'mongodb://localhost:27017'
  // Database Name
  const dbName = 'cleanchoice'
  // Use connect method to connect to the server
  mongodb.MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
    // Check for error
    assert.equal(null, err)
    const mongoDB = await client.db(dbName)

    try {
      // Connect to SQL
      await syncSqlData(mongoDB)
    } catch (e) {
      console.log(e)
    } finally {
      client.close()
    }
  })
}

// run the sync
start()

/*
* Misc Helper Functions Below
*/

// Populate the Mongo collection
// NOTE: this function is asynchronous and is not returning a promise on purpose
const populateCollection = async (conn, query, mongoDB, collectionName) => {
  let rawData = await runSqlQuery(conn, query)
  let documents = map(rawData, convertObj)
  const collection = mongoDB.collection(collectionName)
  await collection.insertMany(documents)
}

// Promisify the SQL query
const runSqlQuery = async (conn, query) => {
  return new Promise((resolve, reject) => {
    conn.query(query, (err, result, fields) => {
      if (err) throw err;
      resolve(result)
    })
  }, err => {
    reject(err)
  })
}

// Tool for restructuring each object to a proper document
const convertObj = obj => {
  obj = mapkeys(obj, convertKeyToCamelCase)
  return omit(obj, 'id')
}

// Convert field name to camelcase
const convertKeyToCamelCase = (val, key) => {
  // The field names we need to change will always be in this format: 'word_word'
  // Due to this, we only need to replace the underscore with the letter following it in uppercase
  return key.replace(/_[a-z]/g, $1 => $1.substring(1).toUpperCase())
}
