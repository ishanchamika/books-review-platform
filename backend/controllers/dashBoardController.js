const dashboard = (req, res) => 
{
    const user = req.user;
  
    if (user) 
    {
      return res.status(200).json({
        message: 'Welcome to the dashboard',
        user: {
          id: user.userId,
          email: user.email,
        },
      });
    } else {
      return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }
  };
  
  module.exports = { dashboard };
  