const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check that username is a non-empty string
  if (typeof username !== "string" || username.trim().length === 0) {
    return false;
  }
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(username)) {
    return false;
  }

  return true;
};

const authenticatedUser = (username,password)=>{ 
  return users.some(user => ( user.username === username && user.password === password));
}

const JWT_SECRET = 'super-jwt-secret-key';

//only registered users can login
regd_users.post("/login", (req,res) => {
   const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please enter username & password" });
  }

  
  if (!authenticatedUser(username,password)) {
    return res.status(401).json({ message: "Wrong credential" });
  }

  // Create JWT
  const payload = { username };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  // Store auth data in session (what middleware expects)
  req.session.authorization = {
    accessToken: token,
    username
  };

  return res.status(200).json({
    message: "Login successful",
    token
  });
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const  review  = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username = req.session.authorization.username;

  // Ensure reviews object exists
  if (!book.reviews) {
    book.reviews = {};
  }

  // Add or update review
  book.reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    isbn,
    user: username,
    review
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
