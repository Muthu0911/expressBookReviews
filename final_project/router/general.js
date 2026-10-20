const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

/**
 * Task 6: Register a new user
 * Validates provided credentials and registers the user if not already existing.
 */
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Username and password are required." });
});

/**
 * Task 1 & 10: Get the complete list of available books
 * Uses Async/Await with Promises to handle asynchronous book list retrieval.
 */
public_users.get('/', async function (req, res) {
  try {
    const fetchBooks = () => new Promise((resolve) => resolve(books));
    const bookList = await fetchBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

/**
 * Task 2 & 11: Get book details based on ISBN
 * Uses Async/Await to search the books database by ISBN parameter.
 */
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const fetchByISBN = (id) => {
      return new Promise((resolve, reject) => {
        if (books[id]) {
          resolve(books[id]);
        } else {
          reject("Book not found for the specified ISBN.");
        }
      });
    };
    const book = await fetchByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

/**
 * Task 3 & 12: Get book details based on Author
 * Filters all books matching the requested author name using Async/Await.
 */
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const fetchByAuthor = (authorName) => {
      return new Promise((resolve, reject) => {
        let matchingBooks = [];
        let keys = Object.keys(books);
        keys.forEach((key) => {
          if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
            matchingBooks.push({ isbn: key, ...books[key] });
          }
        });
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found for the specified author.");
        }
      });
    };
    const result = await fetchByAuthor(author);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

/**
 * Task 4 & 13: Get book details based on Title
 * Filters all books matching the requested title string using Async/Await.
 */
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const fetchByTitle = (titleName) => {
      return new Promise((resolve, reject) => {
        let matchingBooks = [];
        let keys = Object.keys(books);
        keys.forEach((key) => {
          if (books[key].title.toLowerCase() === titleName.toLowerCase()) {
            matchingBooks.push({ isbn: key, ...books[key] });
          }
        });
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found with the specified title.");
        }
      });
    };
    const result = await fetchByTitle(title);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

/**
 * Task 5: Get book reviews based on ISBN
 */
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.general = public_users;
