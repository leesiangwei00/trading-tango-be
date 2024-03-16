import "dotenv/config";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import { User } from "./models/User";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || "4000";

app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log(`Trading Traco Server started on port ${port}.`);
  } catch (error) {
    console.log("Fail to connected to DB.");
  }
});

/**
 * request:
 * email
 * password
 *
 * response code:
 * 200: login success
 * 404: account not exist, signup is required
 * 500: server error
 *
 * response:
 * user data
 */
app.post("/login", async (req, res) => {
  try {
    const result = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (result) {
      return res.status(200).send({
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        country: result.country,
        mobile: result.mobile,
        verifyEmail: result.verifyEmail,
      });
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * request:
 * firstName
 * lastName
 * email
 * mobile
 * country
 * password
 *
 * response code:
 * 201: signup success
 * 400: account existed
 * 500: server error
 *
 * response:
 * user data
 */
app.post("/register", async (req, res) => {
  try {
    const existed = await User.findOne({ email: req.body.email });
    if (existed) {
      return res.sendStatus(400);
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
        verifyEmail: true,
      });
      await user.save();
      return res.status(201).send({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country,
        mobile: user.mobile,
        verifyEmail: user.verifyEmail,
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * request:
 * email
 *
 * response code:
 * 200: email verified
 * 400: email not verified
 * 500: server error
 */
app.post("/verifyemail", async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      { email: req.body.email },
      { verifyEmail: true }
    );
    if (result) {
      return res.sendStatus(200);
    } else {
      throw new Error();
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});
