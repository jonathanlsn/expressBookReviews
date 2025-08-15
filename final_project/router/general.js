const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
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
const getBooksCallback = () => {
    // Simulate an async operation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          if (Object.values(books).length > 0) {
              resolve(Object.values(books));
          } else {
              reject(new Error("No book stored"));
          }
      }, 1000); // Wait for 1 second
    });
};

public_users.get('/',function (req, res) {
  getBooksCallback()
    .then(data => { return res.status(200).json(data) })
    .catch(err => { return res.status(404).json({message: err}) });
});


// Get book details based on ISBN
const getBooksByISBNCallback = (codeISBN) => {
    // Simulate an async operation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          if (codeISBN in books) {
              resolve([books[codeISBN]]);
          } else {
              reject(new Error(`Books with ISBN ${codeISBN} not found`));
          }
      }, 1000); // Wait for 1 second
    });
};

public_users.get('/isbn/:isbn',function (req, res) {
  const codeISBN = req.params.isbn;

  getBooksByISBNCallback(codeISBN)
    .then(data => { return res.status(200).json(data) })
    .catch(err => { return res.status(404).json({message: err}) });
 });
  
// Get book details based on author
const getBooksByAuthorCallback = (author) => {
    // Simulate an async operation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          const booksByAuthor = Object.values(books).filter((book) => book.author.toLowerCase() === author.toLowerCase());
          if (booksByAuthor.length > 0 ) {
            resolve(booksByAuthor);
          } else {
            reject(new Error(`Books with author ${author} not found`));
          }
      }, 1000); // Wait for  second
    });
};

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  
  getBooksByAuthorCallback(author)
    .then(data => { return res.status(200).json(data) })
    .catch(err => { return res.status(404).json({message: err}) });
});

// Get all books based on title
const getBooksByTitleCallback = (title) => {
    // Simulate an async operation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          const booksByTitle = Object.values(books).filter((book) => book.title.toLowerCase() === title.toLowerCase());
          if (booksByTitle.length > 0 ) {
            resolve(booksByTitle);
          } else {
            reject(new Error(`Books with author ${author} not found`));
          }
      }, 1000); // Wait for 1 second
    });
};

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  getBooksByTitleCallback(title)
    .then(data => { return res.status(200).json(data) })
    .catch(err => { return res.status(404).json({message: err}) });
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
