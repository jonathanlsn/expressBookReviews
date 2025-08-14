const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  const filteredUsers = users.filter(user => user.username === username);
  return (filteredUsers.length === 0);
}

const authenticatedUser = (username,password)=>{
  console.log(users);
  const filteredUsers = users.filter(user => (user.username === username && user.password === password));
  return (filteredUsers.length === 1);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (authenticatedUser(username, password)) {
      const payload = {
        username: username
      };
      // Generate JWT access token
      let accessToken = jwt.sign(
        payload, 
        'access',
        { expiresIn: 60 * 5 }
      );

      // Store access token in session
      req.session.authorization = {accessToken}

      return res.status(200).json({message: `user ${username} logged successfully`});
    } else {
      return res.status(401).json({message: "ERROR: wrong username or password"});
    }

  }

  if (!username) {
      return res.status(400).json({ message: "ERROR: username not provided" });
  } 
  if (!password) {
      return res.status(400).json({ message: "ERROR: password not provided" });
  } 

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
