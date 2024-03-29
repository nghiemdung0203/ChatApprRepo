const { Conversation } = require("../controller/Conversation");
const { GetFriends } = require("../controller/GetFriends");
const { Login } = require("../controller/Login");
const { Register } = require("../controller/Register");
const multer = require("multer");
const { SendMessage } = require("../controller/SendMessage");
const {
  GetMessageFromAConversation,
} = require("../controller/GetMessageFromAConversation");
const upload = multer({ dest: "uploads/" });

const router = require("express").Router();

router.post("/signup", upload.single("Avatar"), Register);
router.post("/signin", Login);
router.get("/getFriends", GetFriends);
router.post("/Conversation", Conversation);
router.get("/GetMessageFromAConversation", GetMessageFromAConversation);
router.post("/SendMessage", SendMessage);

module.exports = router;
