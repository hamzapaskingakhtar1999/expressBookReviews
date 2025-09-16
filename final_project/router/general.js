const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ----------------------
// Register new user
// ----------------------
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});


// ----------------------
// Task 10: Get all books
// ----------------------

public_users.get('/', async (req, res) => {
    try {
        const getBooks = async () => {
            return new Promise((resolve, reject) => {
                if (books) resolve(Object.values(books));
                else reject("No books available");
            });
        };

        const booksInfo = await getBooks();
        return res.status(200).json(booksInfo);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

// ----------------------
// Task 11: Get book by ISBN
// ----------------------
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        const getBookByISBN = async (isbn) => {
            return new Promise((resolve, reject) => {
                const book = books[isbn];
                if (book) resolve(book);
                else reject("Book not found");
            });
        };

        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ----------------------
// Task 12: Get books by author
// ----------------------
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;

        const getBooksByAuthor = async (author) => {
            return new Promise((resolve, reject) => {
                const booksInfo = Object.values(books);
                const booksOfAuthor = booksInfo.filter((item) => item.author === author);
                if (booksOfAuthor.length > 0) resolve(booksOfAuthor);
                else reject("Author does not have any books");
            });
        };

        const booksOfAuthor = await getBooksByAuthor(author);
        return res.status(200).json(booksOfAuthor);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ----------------------
// Task 13: Get books by title
// ----------------------
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;

        const getBooksByTitle = async (title) => {
            return new Promise((resolve, reject) => {
                const booksInfo = Object.values(books);
                const booksWithTitle = booksInfo.filter((item) => item.title === title);
                if (booksWithTitle.length > 0) resolve(booksWithTitle);
                else reject("No books found with this title");
            });
        };

        const booksWithTitle = await getBooksByTitle(title);
        return res.status(200).json(booksWithTitle);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ----------------------
// Get book review
// ----------------------
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
