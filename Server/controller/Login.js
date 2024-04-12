const client = require("../cassanndra-driver");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { setUser_id, getUser_id } = require("../Global Variable/userId");

module.exports.Login = async (req, res) => {
  const { Email, Password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? ALLOW FILTERING`;
  const params = [Email];
  const existEmail = await client.execute(query, params);

  if (existEmail.rows.length > 0) {
    const pass = crypto
      .createHash("md5")
      .update(Password)
      .update(
        crypto
          .createHash("md5")
          .update(existEmail.rows[0].salt, "utf-8")
          .digest("hex")
      )
      .digest("hex");

    if (pass === existEmail.rows[0].password) {
      const token = jwt.sign(
        { user_id: existEmail.rows[0].user_id, email: Email },
        "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611",
        { expiresIn: "24h" }
      );
      setUser_id(existEmail.rows[0].user_id.toString())
      console.log(getUser_id())
      return res.status(200).send(token);
    } else {
      return res.status(400).send("incorrect password");
    }
  } else {
    return res.status(400).send("Email does not exist");
  }
};
