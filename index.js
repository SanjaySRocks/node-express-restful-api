require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const { hashSync, compareSync } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mydb = require("./config/db");
const passport = require('passport');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(passport.initialize());
require('./config/passport');

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Test Restful API Server" });
});

app.post("/register", async (req, res) =>{
    const { username, password } = req.body;

    const hash = hashSync(password, 10)
    
    const [rows, fields] = await mydb.query(`SELECT * from test.users WHERE username = '${username}'`);

    if(rows[0])
    {
      return res.status(200).send({ 
        success: false,
        message: "User already registered!",
       })
    }

    if(!rows[0])
    {
      const result = await mydb.query(`INSERT INTO test.users (username, password) VALUES ('${username}', '${hash}')`);
      
      if(result){
        return res.status(200).send({ 
          success: true,
          message: "User registered Successfully!",
         })
      }
    }

    
});

app.post('/login', async (req, res)=>{
  const username = req.body.username
  const password = req.body.password

  const [rows, fields] = await mydb.query(`SELECT * from test.users WHERE username = '${username}'`);

  if(!rows[0]){
    return res.status(401).send({ 
      success: false,
      message: "Username or Password is Incorrect",
    })
  }

  if(!compareSync(password, rows[0].password)){
    return res.status(401).send({ 
      success: false,
      message: "Username or Password is Incorrect",
    })
  }

  var payload = {
    id: rows[0].id,
    username: username
  }

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });

  return res.status(200).send({ 
      success: true,
      message: "User logged in Successfully!",
      token: 'Bearer ' + token
    }) 

})

app.get('/profile', passport.authenticate('jwt', {session: false}), (req, res)=>{
  
  res.status(200).send({ 
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username
    }
  }) 

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
