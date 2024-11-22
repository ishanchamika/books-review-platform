const db = require('../config/db');

//Generic function to execute a query
const executeQuery = (query, params, callback) => 
{
    db.query(query, params, (err, results) => 
    {
        if(err) 
        {
            console.error('Database query error:', err);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
};

const INSERT = (table, ...values) => 
{
    const getColumnsQuery = `DESCRIBE ${table}`;
    
    return new Promise((resolve, reject) => 
    {
      db.query(getColumnsQuery, (err, result) => 
        {
            if(err) 
            {
            return reject(err);
            }
    
            const columns = result
            .filter(col => col.Field !== 'id')
            .map(col => col.Field);
    
            const placeholders = values.map(() => '?').join(', ');
            const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    
            db.query(query, values, (err, result) => 
            {
                if(err) 
                {
                    return reject(err);
                }
                resolve(result);
            });
        });
    });
};


//DELETE
const DELETE = (table, id) => 
{
    const query = `DELETE FROM ${table} WHERE id = ?`;
    return new Promise((resolve, reject) => 
    {
      db.query(query, [id], (err, result) => 
      {
        if(err) 
        {
          console.error('Error deleting record:', err);
          return reject(err);
        }
        resolve(result);
      });
    });
  };


//UPDATE
const UPDATE = (table, id, columns_names, data) => 
{
    const setStatements = columns_names
      .map((col) => `${col} = ?`)
      .join(', ');
  
    const query = `UPDATE ${table} SET ${setStatements} WHERE id = ?`;
  
    const params = [...data, id];
  
    return new Promise((resolve, reject) => {
      db.query(query, params, (err, result) => {
        if (err) {
          console.error('Error updating record:', err);
          return reject(err);
        }
        resolve(result);
      });
    });
  };


//SELECT ALL
const SELECT = (table) => 
{
    return new Promise((resolve, reject) => 
    {
        const query = `SELECT * FROM ${table}`;
        executeQuery(query, [], (err, result) => 
        {
            if(err) 
            {
                reject(err);
            } 
            else 
            {
                resolve(result);
            }
        });
    });
  };
  
  
//FIND ONE
const FINDONE = (table, column_name, value) => 
{
    return new Promise((resolve, reject) => 
    {
        const query = `SELECT * FROM ${table} WHERE ${column_name} = ?`;
        executeQuery(query, [value], (err, result) => 
        {
            if(err) 
            {
                reject(err);
            } 
            else 
            {
                resolve(result);
            }
        });
    });
};

// FIND ONE
const FindByBookIdAndUserID = (table, bookid, userid) => 
  {
      return new Promise((resolve, reject) => 
      {
          const query = `SELECT * FROM ${table} WHERE book_id = ? AND user_id = ?`;
          executeQuery(query, [bookid, userid], (err, result) => 
          {
              if (err) 
              {
                  reject(err);
              } 
              else 
              {
                  resolve(result);
              }
          });
      });
  };
  
module.exports = {INSERT, DELETE, UPDATE, SELECT, FINDONE, FindByBookIdAndUserID, executeQuery};
