const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  // Declare a variable to store the token.
  let token;

  // Try to get the authorization header from the request, checking both uppercase and lowercase "Authorization".
  let authHeader = req.headers.Authorization || req.headers.authorization;

  // Check if an authorization header exists and if it starts with "Bearer".
  if (authHeader && authHeader.startsWith("Bearer")) {
    // If it does, split the header to extract the actual token (the second part).
    token = authHeader.split(" ")[1];

    // Verify the token's validity using a secret key and a callback function.
    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
      if (err) {
        // Return an error response indicating that the token is invalid.
        return res.status(403).json({ error: "Invalid token" });
      }
      // If the token is valid, assign the decoded user data to the request object.
      req.user = decoded.user;

      // Call the "next()" function to pass control to the next middleware.
      next();
    });
  } else {
    // If the "token" variable is still not assigned (header didn't start with "Bearer").
    // Set the HTTP response status to 401 (Unauthorized).
    // Return an error response indicating that the user is not authorized or the token is missing.
   
    return res.status(401).json({ error: "User is not authorized or token is missing" });
  }
};

module.exports = validateToken;
