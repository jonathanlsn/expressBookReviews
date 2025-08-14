const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      console.log(isValid(username))
      if (isValid(username)) {
          users.push({username: username, password: password});
          return res.status(200).json({message: `User ${username} registered successfully`});
      } else {
          return res.status(400).json({message: `Invalid username: ${username} exists already`});
      }
  } else {
      return res.status(400).json({message: "Missing parameter: Expecting username and password in request body"});
  }
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
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((book) => book.author.toLocaleLowerCase() === author.toLocaleLowerCase())

  if (booksByAuthor.length > 0 ) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({message: `Books with author ${author} not found`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter((book) => book.title.toLocaleLowerCase() === title.toLocaleLowerCase())

  if (booksByTitle.length > 0 ) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: `Books with title ${title} not found`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const codeISBN = req.params.isbn;

  if (codeISBN in books) {
      if (Object.keys(books[codeISBN].reviews).length > 0) {
          return res.status(200).json(Object.values(books[codeISBN].reviews));
      } else {
          return res.status(404).json({message: `Book with ISBN ${codeISBN} has no reviews`});
      }
    
  } else {
    return res.status(404).json({message: `Book with ISBN ${codeISBN} not found`});
  }
});

module.exports.general = public_users;
