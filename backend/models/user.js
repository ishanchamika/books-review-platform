const ValidateRegister = (email, password, name) => {
  if (!email) {
      return 'Email is required';
  }
  if (!password) {
      return 'Password is required';
  }
  if (!name) {
      return 'Name is required';
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      return 'Invalid email format';
  }

  // Validate password complexity
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$/;
if (!passwordRegex.test(password)) {
    return 'Password must include at least one uppercase letter, one lowercase letter, one number, one special character (!@#$%^&*), and be at least 7 characters long';
}


  // Validation passed
  return null;
};

module.exports = {
  ValidateRegister,
};
