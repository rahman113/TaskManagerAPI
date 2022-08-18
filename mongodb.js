//const mongodb = require('mongodb')
//const MongoClient = mongodb.MongoClient
//const ObjectId = mongodb.ObjectId;

const { MongoClient, ObjectId } = require('mongodb');
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
      if (error) {
            return console.log('Unable to connect to database!')

      }
      const db = client.db(databaseName)

      // // db.collection('users').findOne({_id: new ObjectId('61f4dbeb707fe226e5591187')}, (error, result) =>{
      // // if(error){

      // //   console.log(error)
      // // }

      // // console.log(result);

      // } )

      // db.collection('users').find({name : 'Ataurrahman'}).toArray((error, count) =>{
      // if(error)
      // {
      //   console.log(error);
      // }
      // console.log(count);
      // })
      // db.collection('document').insertOne({
      //     name: 'Ataurrahman',
      //     age: 24
      // }, (error, result) =>
      // {     if(error)
      //     {
      //       return console.log("unable to document in users collection");
      //     }
      //     console.log(result.ops);
      //   });
      // db.collection('document').findOne({_id: ObjectId('61f4e67aef9960307b9e425a')}, (error, document) =>
      // {
      //   if(error){
      //         return console.log('unable to fetch record!')

      //   }
      //    console.log(document);
      // })

      // db.collection('users').insertMany([
      //     {
      //         name: "Ataurrahman",
      //         age: 27,
      //         course: "mern stack",
      //         address: "philadephia",
      //         country: "New york"
      //     },
      //     {
      //         name: "Ataurrahman",
      //         age: 24,
      //         course: "mern stack",
      //         address: "siddharthnagar up",
      //         country: "India"
      //     }
      // ],  (error, result) =>
      // {     if(error)
      //     {
      //       return console.log("unable to document in users collection");
      //     }

      //     console.log(result.ops);
      //  });
      //   
      // db.collection('users').updateMany({_id: ObjectId('61f4dbeb707fe226e5591186')},
      // {
      //       $set : {
      //             course: 'Mean Stack',
      //             address: 'Boston'
      //       }
      // }
      // )
      // .then((result) =>{
      //       if(result){

      //       console.log(result);
      //       }
      // }).catch((error) => {

      //       console.log(error)
      // })


})

