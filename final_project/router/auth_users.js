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

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
   const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please enter username & password" });
  }

  const alreadyRegistered = users.some(user => user.username === username);
  if (alreadyRegistered) {
    return res.status(400).json({ message: "User already has an account" });
  }

  // Add the new user
  users.push({ username, password });

  return res.status(200).json({ message: `The user ${username} has been created` });
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
