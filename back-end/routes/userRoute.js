const router = require('express').Router();
const {
  registerUser,
  loginUser,
  tokenVerify,
  profileUpdate,
} = require("../controllers/usersController");
const validateToken = require("../middleware/vaildateTokenHandler");


router.post("/register", registerUser);

router.post("/login", loginUser);
router.get("/verify", validateToken, tokenVerify);
router.put("/update/:id", validateToken, profileUpdate);

module.exports = router;
