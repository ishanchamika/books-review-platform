const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const query = require('../queries/dbQueries')
const { ValidateRegister } = require('../models/user');
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

const reviews = async (req, res) => 
{
  try 
  {

    const queryx = `
            SELECT 
                reviews.id AS review_id,
                users.name AS user_name,
                users.email AS user_email,
                books.title AS book_title,
                books.author AS book_author,
                reviews.rating,
                reviews.review_text,
                reviews.date_added
            FROM 
                reviews
            JOIN 
                users ON reviews.user_id = users.id
            JOIN 
                books ON reviews.book_id = books.id;
        `;
    // Use the promise
    const [reviews] = await db.promise().query(queryx);
    res.status(200).json(reviews);
  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews for the user' });
  }
};




const addReview = async (req, res) =>
{
    const userId = req.params.userId;
    const bookTitle = req.body.title;
    const author = req.body.author;
    const rating = req.body.rating;
    const review_text = req.body.review_text;

    try
    {
        if(!userId || userId == '')
        {
          return res.status(400).json({ error: "user id required" });        
        }
        if(!bookTitle || bookTitle == '')
        {
          return res.status(400).json({ error: "Book Title is Required" });        
        }
        if(!author || author =='')
        {
          return res.status(400).json({ error: "Author is required" });
        }
        if(!rating || rating == '')
        {
          return res.status(400).json({ error: "rating is required" });
        }
        if(!review_text || review_text == '')
        {
          return res.status(400).json({ error: "review is required" });
        }

        const add_book = await query.INSERT('books', [bookTitle, author, currentDate]);
        if(add_book.affectedRows > 0)
        {
          const book_id = add_book.insertId;
          const add_review = await query.INSERT('reviews', [userId, book_id, rating, review_text, currentDate]);
          return res.status(201).json({ message: 'success', add_book});
        }
        else
        {
          return res.status(400).json({ error: "Failed...!"});
        }
    }
    catch(error)
    {
        return res.status(500).json({ error: error.message });
    }
};


const getReviewById = async (req, res) =>
{
    const id = req.params.id;
    const response = await query.FINDONE('reviews','id', id);
    try
    {
        return res.status(200).json({message: "success", data: response});
    }
    catch(error)
    {
        return res.status(500).json({ error: err.message });
    }
}


const updateReview = async (req, res) => 
{
    try 
    {
        
      const { id, userId } = req.params; //id=book_id
      const { rating, review_text } = req.body;
  
      if(rating < 1 || rating > 5) 
      {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      const ifresult = await query.FindByBookIdAndUserID('reviews',id, userId);
  
      if(!ifresult || ifresult.length === 0) 
      {
        return res.status(404).json({ error: 'Review not found' });
      }
      const review_id = ifresult[0].id;
      const update_res = await  query.UPDATE('reviews',review_id, ['rating', 'review_text'], [rating, review_text]);

      if(!update_res || update_res.length === 0 || update_res.changedRows === 0)
      {
        return res.status(404).json({ error: 'review update failed' });
      }
      return res.status(200).json({ message: 'Review updated successfully', update_res });
    } 
    catch (error) 
    {
      res.status(500).json({ error: 'Failed to update review' });
    }
  };
  
  


  const getReviewsForUser = async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId);
  
      const query = `
        SELECT 
            books.id AS book_id,
            books.title AS book_title,
            books.author AS book_author,
            users.name AS user_name,
            users.email AS user_email,
            reviews.rating,
            reviews.review_text,
            reviews.date_added,
            reviews.id
        FROM 
            reviews
        INNER JOIN 
            books ON reviews.book_id = books.id
        INNER JOIN 
            users ON reviews.user_id = users.id
        WHERE 
            users.id = ?;
      `;
  
      // Use the promise wrapper
      const [reviews] = await db.promise().query(query, [userId]);
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch reviews for the user' });
    }
  };
  
  

  const getReviewByUserAndBook = async (req, res) => {
    try {
      const { userId, bookId } = req.params;
  
      const query = `
        SELECT 
            reviews.id AS review_id,
            books.title AS book_title,
            books.author AS book_author,
            users.name AS user_name,
            users.email AS user_email,
            reviews.rating,
            reviews.review_text,
            reviews.date_added
        FROM 
            reviews
        INNER JOIN 
            books ON reviews.book_id = books.id
        INNER JOIN 
            users ON reviews.user_id = users.id
        WHERE 
            users.id = ? AND books.id = ?;
      `;
  
      // Use the promise wrapper
      const [review] = await db.promise().query(query, [userId, bookId]);
  
      if (review.length === 0) {
        return res.status(404).json({ error: 'Review not found for this user and book' });
      }
  
      res.status(200).json(review[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch review for the user and book' });
    }
  };


  const deleteReview = async (req, res) => {
    const review_id = req.params.id;
  
    try {
      const review = await query.FINDONE('reviews','id', review_id);
      if (!review) 
      {
        return res.status(404).json({ error: 'Review not found' });
      }

      const id = review[0].book_id;
      const result = await query.DELETE('reviews', review_id);
      const result2 = await query.DELETE('books', id);
  
      if (result.affectedRows === 0) 
      {
        return res.status(400).json({ error: 'Failed to delete the review' });
      }
      return res.status(200).json({ message: 'Review deleted successfully' });
    } 
    catch (error) 
    {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete review' });
    }
  };
  
  
module.exports = { reviews , getReviewById, updateReview, getReviewsForUser, getReviewByUserAndBook, addReview, deleteReview};