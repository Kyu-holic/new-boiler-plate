const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log({ err: err.message });
  });

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/register", (req, res) => {
  //회원 가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.status(400).send({ err: err.message });
    return res.status(200).send({
      success: userInfo,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
