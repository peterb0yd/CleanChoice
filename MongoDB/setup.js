const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

// Connection URL
const url = 'mongodb://localhost:27017'

// Database Name
const dbName = 'cleanchoice'

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
  // Check for error
  assert.equal(null, err)

  const db = client.db(dbName)

  db.dropDatabase() // WARNING: this will reset the mongo database

  try {
    // Set up collections
    await createCustomersCollection(db)
    await createEnrollmentsCollection(db)

    // Populate with documents
    // await populateCustomerAccounts(db) // NOTE: uncomment this to populate collection with hard-coded data
    // await populateEnrollmentAttempts(db) // NOTE: uncomment this to populate collection with hard-coded data

    // Used for debugging
    const collections = await db.listCollections().toArray()
    const accounts = await db.collection('customerAccounts').find().toArray()
    const attempts = await db.collection('enrollmentAttempts').find().toArray()
    console.log(collections)
    console.log(accounts)
    console.log(attempts)

  } catch (e) {
    console.log(e)
  } finally {
    client.close()
  }
})


// for JsonSchema String Property redundancy
const stringProperty = {
  bsonType: 'string',
  description: 'must be a string and is required'
}

// Create collection and define validations
const createCustomersCollection = db => {
  try {
    db.createCollection('customerAccounts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [ 'name', 'serviceAddress', 'phone', 'email', 'electricityUtility', 'accountNumber', 'status' ],
          properties: {
            name: stringProperty,
            serviceAddress: stringProperty,
            phone: stringProperty,
            email: stringProperty,
            electricityUtility: stringProperty,
            accountNumber: {
              bsonType: 'int',
              description: 'must be an integer and is required'
            },
            status: {
              enum: [ 'Pending', 'Accepted', 'Rejected', 'Closed' ],
              description: 'can only be one of the enum values and is required'
            }
          }
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}

// Create collection and define validations
const createEnrollmentsCollection = db => {
  try {
    db.createCollection('enrollmentAttempts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [ 'customerId', 'marketingChannel', 'dateRecorded' ],
          properties: {
            customerId: {
              bsonType: 'int',
              description: 'must be an existing customer id and is required'
            },
            marketingChannel: {
              enum: [ 'Mail', 'Telemarketing', 'Web' ],
              description: 'can only be one of the enum values and is required'
            },
            dateRecorded: {
              bsonType: 'date',
              description: 'must be a date and is required'
            }
          }
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}


// Fill collection with test data
const populateCustomerAccounts = db => {
  try {
    const customerAccounts = db.collection('customerAccounts')
    customerAccounts.insertMany([
        {
          name: 'Peter Boyd',
          serviceAddress: '1310 Noyes Dr 20910',
          phone: '2407235209',
          email: 'peterboyd192@gmail.com',
          electricityUtility: 'Pepco',
          accountNumber: 1234567,
          status: 'Accepted'
        },
        {
          name: 'Joe Shmoe',
          serviceAddress: '444 16th St. 20001',
          phone: '2409553212',
          email: 'joe@gmail.com',
          electricityUtility: 'Pepco',
          accountNumber: 1233466,
          status: 'Rejected'
        },
        {
          name: 'Bob Smith',
          serviceAddress: '5434 Georgia Ave 20910',
          phone: '3555553333',
          email: 'bobs@gmail.com',
          electricityUtility: 'Pepco',
          accountNumber: 3425555,
          status: 'Pending'
        }
    ])
  } catch (e) {
    console.log(e)
  }
}

// Fill collection with test data
const populateEnrollmentAttempts = db => {
  try {
    const enrollmentAttempts = db.collection('enrollmentAttempts')
    enrollmentAttempts.insertMany([
      {
        customerId: 3,
        marketingChannel: 'Telemarketing',
        date: new Date()
      },
      {
        customerId: 2,
        marketingChannel: 'Mail',
        date: new Date()
      },
      {
        customerId: 2,
        marketingChannel: 'Web',
        date: new Date()
      },
      {
        customerId: 1,
        marketingChannel: 'Telemarketing',
        date: new Date()
      },
      {
        customerId: 3,
        marketingChannel: 'Telemarketing',
        date: new Date()
      },
      {
        customerId: 2,
        marketingChannel: 'Mail',
        date: new Date()
      },
      {
        customerId: 1,
        marketingChannel: 'Web',
        date: new Date()
      }
    ])
  } catch (e) {
    console.log(e)
  }
}
