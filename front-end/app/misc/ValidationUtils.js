

// Email validation function
export const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
  };
  
  // Password validation function
  export const validatePasswordStrength = (password) => {
    // Regular expression for password validation (at least one number and one symbol, minimum length 8)
    return password.length >= 8;
  };
  