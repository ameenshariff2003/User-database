const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodoverride = require("method-override");
const {v4:uuidv4}=require("uuid");
const { compile } = require('ejs');
let port = 8080;

app.use(methodoverride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));




const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'ameen',
  });

  let getRandomUser = () =>{
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
      
    ];
  };
  //insert into table

//   let q = "INSERT into user(id,username,email,password) VALUES ?";
  
//  let data = [];
//  for(let i=0;i<=100;i++){
//   data.push(getRandomUser());
 //}
//running the db query using js 


  // connection.end();
  //home route

  app.get("/",(req,res)=>{
    let q = "select count(*) from user";
    try {
      connection.query(q,(err,result)=>{
          if(err) throw err;
          let count=result[0]["count(*)"];

          res.render("home.ejs",{count});
      })
      
    } catch (err) {
      console.log(err);
      res.send("error hi bhai");

      
    }

  });
  //show raoute
app.get("/user",(req,res)=>{
  let q = `select * from user`;
  try {
    connection.query(q,(err,users)=>{
        if(err) throw err;

      // console.log(result);
      // res.send(result);
      res.render("users.ejs",{users});
    })
    
  } catch (err) {
    console.log(err);
    res.send("error hi bhai");

    
  }
});

//edit rout
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `select * from user where id='${id}'`;
  
  console.log(id);
  try {
    connection.query(q,(err,result)=>{
        if(err) throw err;
        console.log(result);

      let user = result[0];
      res.render("edit.ejs",{user});
    })
    
  } catch (err) {
    console.log(err);
    res.send("error hi bhai");

    
  }
});

// update route
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password:formpass,username:newusername}=req.body;
  let q = `select * from user where id='${id}'`;
  
  
  console.log(id);
  try {
    connection.query(q,(err,result)=>{
        if(err) throw err;

      let user = result[0];
      if (formpass != user.password){
        res.send("wrong password")
      }
      else{
        let q2 = `update user set username='${newusername}' where id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        })
      }
    })
    
  } catch (err) {
    console.log(err);
    res.send("error hi bhai");

    
  }
});
//adding new user

app.get("/user/adduser",(req,res)=>{
  res.render("adduser.ejs");
});

//posting the data
app.post("/user/adduser",(req,res)=>{
  let {username,email,password}=req.body;
  let id = uuidv4();
  console.log(req.params);
  let q = `insert into user values ('${id}','${username}','${email}','${password}');`;
  try {
    connection.query(q,(err,result)=>{
      console.log(result);
        if(err) throw err;

      console.log("added new user");
     // res.send("hello ji");
      res.redirect("/user");
    })
    
  } catch (err) {
    console.log(err);
    res.send("error hi bhai");

    
  }
});
app.get("/user/:id/delete",(req,res)=>{
  let {id} = req.params;
  let q = `select * from user where id= '${id}'`;

  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
        let user = result[0];

      res.render("delete.ejs",{user});
    });
  

  }catch(err){
    res.send("err hai bhai");
  }});

app.delete("/user/:id/",(req,res)=>{
  let {id} = req.params;
  let { password} = req.body;
  let q = `select * from user where id= '${id}'`;
  try {
    connection.query(q,(err,result)=>{
      console.log(result);
      
        if(err) throw err;
        let user = result[0];
        console.log(result);

        if(user.password != password){
          res.send("enter the correct password");
        }
        else{
          let q2 = `delete from user where id='${id}'`;
          connection.query(q2,(err,result)=>{
            if(err) throw err;
            else{
              console.log(result);

              console.log("deleted")
              res.redirect("/user")
            }
          });
        }
    });
    
  } catch (err) {
    res.send("error hi bhai");

    
  }
});


  app.listen(port,()=>{
    console.log("listening");
  })


// passcode is 319000
