require('dotenv').config();
const express = require('express');
require('./config/dbconfig');
const cors = require('cors');
const Movie = require('./models/modelScheema');
const { RandomNumber } = require('./utils/otpHelper');
const { SendEmail } = require('./utils/emailHelper');
const OtpModel = require('./models/otpScheema');
const User = require('./models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT;

const app = express();
// app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Welcome to home page</h1>');
});

app.get('/movies', async (req, res) => {
  try {
    const data = await Movie.find();
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    console.log('Error in the GET: ', error.message);
    res.status(500).json({
      status: 'Failure',
      message: 'Internal server error',
    });
  }
});

app.get('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Movie.findById(id);
    // console.log(data);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    console.log('error in get single: ', error.message);
    res.status(500).json({
      status: 'failure',
      message: 'Internal server error',
    });
  }
});

app.patch('/movies/:MovieId', async (req, res) => {
  try {
    const { MovieId } = req.params;
    const { userName, comment, rating, ...updateData } = req.body;
    const newReview = { userName, comment, rating };

    let updateQuery = {};
    if (newReview) {
      updateQuery.$push = { reviews: newReview };
    }

    if (Object.keys(updateData).length > 0) {
      updateQuery.$set = updateData;
    }
    // console.log(updateQuery);

    // const { _id, ...reqData } = req.body;
    const data = await Movie.findByIdAndUpdate(MovieId, updateQuery, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.status(200).json({
      status: 'sucess',
      data,
    });
  } catch (error) {
    console.log('Error in Patch', error.message);
    res.status(500).json({
      status: 'Failure',
      message: 'Internal server error',
    });
  }
});

app.post('/movies', async (req, res) => {
  try {
    const reqData = req.body;
    const data = await Movie.create(reqData);
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    console.log('Error in post: ', error.message);
    res.status(500).json({
      status: 'Failure',
      message: 'Error in internal servver error',
    });
  }
});

app.post('/otps', async (req, res) => {
  try {
    const { email, name } = req.body;
    // console.log(email);

    if (!email) {
      res.status(400).json({
        status: 'failure',
        message: 'Email is not present in the parameter',
      });
      return;
    }

    const userExists = await User.findOne({
      email: email,
    });

    if (userExists) {
      console.log(userExists);
      res.status(400).json({
        status: 'failure',
        message: 'Email already exists',
      });
      return;
    }

    const otp = RandomNumber();
    // console.log(otp);

    await SendEmail(email, otp);

    const newSalt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), newSalt);
    console.log(hashedOtp);

    res.status(200).json({
      status: 'success',
    });

    await OtpModel.create({
      email,
      otp: hashedOtp,
    });
  } catch (error) {
    console.log('Error in otp: ', error.message);
    res.status(500).json({
      status: 'failure',
      message: 'Internal server error',
    });
  }
});

app.post('/users/register', async (req, res) => {
  try {
    const { email, otp, password, name } = req.body;
    console.log(otp, password);

    const isEmailExists = await OtpModel.findOne({
      email: email,
    }).sort('-createdAt');

    if (!isEmailExists) {
      res.status(400).json({
        status: 'fail',
        message: 'invalid email',
      });
      return;
    }

    const { otp: newotp } = isEmailExists;

    const isOtpCorrect = await bcrypt.compare(otp.toString(), newotp);

    if (!isOtpCorrect) {
      res.status(400).json({
        status: 'fail',
        message: 'invalid otp',
      });
      return;
    }

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      res.status(400).json({
        status: 'fail',
        message: 'Email already exists',
      });
      return;
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedpassword,
      name,
    });

    res.status(200).json({
      status: 'success',
      user: newUser,
    });
  } catch (error) {
    console.log('Error in users post: ', error.message);
    if (error.name === 'ValidationError') {
      res.status(400).json({
        status: 'fail',
        message: 'Email already exists',
      });
      return;
    }
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: 'fail',
        message: 'email and password are required',
      });
      return;
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.status(400).json({
        status: 'fail',
        message: 'incorrect email or password',
      });
      return;
    }

    const { password: newpassword, name, _id } = userExists;

    const verifiedPassword = await bcrypt.compare(password, newpassword);

    if (!verifiedPassword) {
      res.status(400).json({
        status: 'fail',
        message: 'password incorrect',
      });
      return;
    }

    const token = jwt.sign(
      {
        email,
        _id,
        name,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '1d',
      }
    );

    // console.log(token);

    res.cookie('authorization', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.status(200).json({
      status: 'success',
      data: {
        email,
        name,
      },
    });
  } catch (error) {
    console.log('error in log in: ', error.message);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
});

app.use(cookieParser());

const authorizationMiddleWare = (req, res, next) => {
  const { authorization } = req.cookies;
  console.log('auth: ', authorization);
  if (!authorization) {
    return res.status(401).json({
      status: 'fail',
      message: 'unauthorized',
    });
  }

  jwt.verify(authorization, process.env.JWT_SECRET_KEY, (error, data) => {
    if (error) {
      console.log(error.message);
      res.status(401).json({
        status: 'fail',
        message: 'authrozation failed',
      });
    } else {
      console.log(data);
      req.User = data;
      next();
    }
  });
};

app.get('/users/me', authorizationMiddleWare, (req, res) => {
  try {
    const { email, name } = req.User;
    res.status(200).json({
      status: 'success',
      data: {
        email,
        name,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.get('/user/logout', (req, res) => {
  res.clearCookie('authorization');
  res.json({
    status: 'success',
    message: 'logout sucessfully',
  });
});

app.patch('/movies/:MovieId/reviews/:reviewId', async (req, res) => {
  const { MovieId, reviewId } = req.params;
  const { comment } = req.body;
  console.log(comment);
  const data = await Movie.findByIdAndUpdate(
    MovieId,
    {
      $set: {
        'reviews.$[elem].comment': comment,
      },
    },
    { new: true, arrayFilters: [{ 'elem._id': reviewId }] }
  );
  res.status(200).json({
    status: 'success',
    data,
  });
});

app.delete('/movies/:MovieId', async (req, res) => {
  try {
    const { MovieId } = req.params;
    const deleteddata = await Movie.findByIdAndDelete(MovieId);
    res.status(201).json({
      status: 'success',
      deleteddata,
    });
  } catch (error) {
    console.log('Error in delete: ', error.message);
    res.status(500).json({
      status: 'failure',
      message: 'internal server error',
    });
  }
});

app.delete('/movies/:MovieId/reviews/:ReviewId', async (req, res) => {
  try {
    const { MovieId, ReviewId } = req.params;

    const data = await Movie.findByIdAndUpdate(MovieId, {
      $pull: { reviews: { _id: ReviewId } },
    });

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    console.log('error in Delete Reviews: ', error);
    res.status(500).json({
      status: 'Failure',
      message: 'internal server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});