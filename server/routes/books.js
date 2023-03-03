/*
File Name: "books.js"
Developer Name: "Fu Liang"
Student ID: 301323706
Date : 3 Mar, 2023
File Function: defining the routes for books
*/

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    res.render('books/details', {title: 'Add Books', books: {}});
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    // create a new book model
    let newBook = book({
        "Title": req.body.title,
        "Author": req.body.author,
        "Genre": req.body.genre,
        "Price": req.body.price,
    })   

    // persist the new book model into the db
    book.create(newBook, (err, Book) => {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            // refresh the book list 
            res.redirect('/books');
        }
    })

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    let id = req.params.id;

    book.findById(id, (err, bookToEdit) => {
        if(err){
            res.end(err);
        } else {
            res.render("books/details", {title: "Edit Book", books: bookToEdit})
        }
    });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    let id = req.params.id;
    let updatedBook = book({
        "_id": id,
        "Title": req.body.title,
        "Author": req.body.author,
        "Genre": req.body.genre,
        "Price": req.body.price,
    })
    book.updateOne({_id: id}, updatedBook, (err) => {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            // refrest the book list
            res.redirect('/books')
        }
    });

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
    let id = req.params.id;
    book.remove({_id: id}, (err) => {
        if(err){
            console.log(err);
            res.send(err);
        } else {
            res.redirect('/books')
        }
    })
});


module.exports = router;
