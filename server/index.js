const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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

app.get("/api/hello", (req, res) => {
  res.send("하이하이~");
});

app.post("/api/users/register", (req, res) => {
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

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 DB에서 있는지 확인
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.status(400).send({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    // 있다면 비밀번호 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.status(400).send({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
      // 비밀번호까지 맞다면 Token 생성
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }
        res
          .cookie("x_auth", user.token)
          .status(200)
          .send({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  const { _id, isAdmin, isAuth, email, name, lastname, role, image } = req.user;
  // 여기까지 미들웨어를 통과했다는 얘기는 Authentication이 True라는 말.
  res.status(200).send({
    _id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true, 
    email,
    name,
    lastname,
    role,
    image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return req.send({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
