const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter username & password" });
  }

  const alreadyRegistered = users.some((user) => user.username === username);
  if (alreadyRegistered) {
    return res.status(400).json({ message: "User already has an account" });
  }

  // Add the new user
  users.push({ username, password });

  return res
    .status(200)
    .json({ message: `The user ${username} has been created` });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const getBooks = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 0);
      });

    const data = await getBooks();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  try {
    const getBook = () =>
      new Promise((resolve) => {
        setTimeout(() => {
            if (!book) {
            reject("Book not found");
          } else {
            resolve(book);
          }
        }, 0);
      });

    const data = await getBook();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;

  try {
    const getBooksByAuthor = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          const matchedBooks = [];

          for (const key in books) {
            if (books[key].author === author) {
              matchedBooks.push(books[key]);
            }
          }

          resolve(matchedBooks);
        }, 0);
      });

    const result = await getBooksByAuthor();

    if (result.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const getBooksByTitle = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          const matchedBooks = [];

          for (const key in books) {
            if (books[key].title.toLowerCase() === title) {
              matchedBooks.push(books[key]);
            }
          }

          resolve(matchedBooks);
        }, 0);
      });

    const result = await getBooksByTitle();

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No books with this title was found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 2));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
