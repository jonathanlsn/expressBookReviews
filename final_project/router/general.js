const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    if (Object.values(books).length > 0) {
        return res.status(200).json(Object.values(books));
    } else {
        return res.status(404).json({message: "No book stored"});
    }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const codeISBN = req.params.isbn;

  if (codeISBN in books) {
    return res.status(200).json([books[codeISBN]]);
  } else {
    return res.status(404).json({message: `Books with ISBN ${codeISBN} not found`});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
