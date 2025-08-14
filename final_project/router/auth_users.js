const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const JWTSecretKey = "jwt_special_key";

let users = [];

const isValid = (username)=>{
  const filteredUsers = users.filter(user => user.username === username);
  return (filteredUsers.length === 0);
}

const authenticatedUser = (username,password)=>{
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
        JWTSecretKey,
        { expiresIn: 60 * 15 }
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

  const comment = req.body.comment;
  const ISBN = req.params.isbn;
  const username = req.user.username;

  if (!username) {
    return res.status(400).json({message: `Missing username in user`});
  }
  if (!comment) {
    return res.status(400).json({message: `Missing comment in body`});
  }

  const reviewId = Object.keys(books[ISBN].reviews)
  .find(id => books[ISBN].reviews[id].username === username);

  if (reviewId) {
    books[ISBN].reviews[reviewId].comment = comment;
    return res.status(200).json({message: `Review from ${username} updated`});
  } else {
    const newReviewId = Math.max(Object.keys(books[ISBN].reviews)) + 1
    books[ISBN].reviews[newReviewId] = {username, comment};
    return res.status(200).json({message: `New review added by ${username}`});
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const ISBN = req.params.isbn;

  if (!username) {
    return res.status(400).json({message: `Missing username in user`});
  }

  const reviewId = Object.keys(books[ISBN].reviews)
  .find(id => books[ISBN].reviews[id].username === username);

  if (reviewId) {
    delete books[ISBN].reviews[reviewId];
    res.status(200).json({message: `review from ${username} removed`});
  } else {
    res.status(200).json({message: `Nothing to remove`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.JWTSecretKey = JWTSecretKey;
