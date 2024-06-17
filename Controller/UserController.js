const EmployeesModel = require("../Model/EmployeesModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const CheckInOutModel = require("../Model/CheckInOutSchema");
// const TeaCheckInOutModel = require("../Model/TeaBreakModel");
const moment = require("moment");
const saltRounds = 10;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    const newUser = await EmployeesModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

//login//
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await EmployeesModel.findOne({ email });

    if (!user) {
      return res.status(404).json("No record exists");
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json("The password is incorrect");
    }

    // Passwords match, generate token
    const token = jwt.sign(
      { email: user.email, _id: user._id },
      "jwt-secret-key",
      {
        expiresIn: "1d",
      }
    );

    // Set cookie with token

    res.cookie("token", token);

    // Respond with success and user ID
    res.json({ message: "Success", userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json("Login failed. Please try again.");
  }
};

// function to handle checkin//
const checkin = async (req, res) => {
  try {
    let { userId, startTime } = req.body;
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const employee = await EmployeesModel.findById(userId);

    if (!employee) {
      return res.status(404).json({ message: "User not found." });
    }

    const checkInRecord = new CheckInOutModel({
      userId: userIdObj,
      startTime,
      endTime: null,
    });

    const savedRecord = await checkInRecord.save();

    return res.status(201).json(savedRecord);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//function to handlecheckout//
const checkout = async (req, res) => {
  try {
    const { endTime, userId } = req.body;

    const updatedRecord = await CheckInOutModel.findOneAndUpdate(
      { userId, endTime: null },
      { endTime },
      { new: true }
    );

    if (!updatedRecord) {
      return res
        .status(404)
        .json({ message: "Record not found or already checked out" });
    }

    return res.json(updatedRecord);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//apply for leave//
const leave = async (req, res) => {
  const { reason, startDate, endDate, _id } = req.body;
  try {
    const leave = new LeaveModel({
      user: _id,
      reason,
      startDate,
      endDate,
    });
    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: "Error applying for leave" });
  }
};

//get employee data//
const employees = async (req, res) => {
  try {
    const employees = await CheckInOutModel.find({});
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};
//get attendance data//
const attendance = async (req, res) => {
  const { userId } = req.params;
  try {
    const attendance = await CheckInOutModel.find({ userId });
    res.json(attendance);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};
//function to record tea break//
const Teabreakcheckin = async (req, res) => {
  try {
    let { userId, startTime } = req.body;
    console.log(req.body, "$$$$");
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const employee = await EmployeesModel.findById(userId);

    if (!employee) {
      return res.status(404).json({ message: "User not found." });
    }

    const checkInRecord = new TeaCheckInOutModel({
      userId: userIdObj,
      startTime,
      endTime: null,
    });
    console.log("00000");
    const savedRecord = await checkInRecord.save();
    console.log("-----");
    return res.status(201).json(savedRecord);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//function to tea break
const Teabreakcheckout = async (req, res) => {
  try {
    const { endTime, userId } = req.body;

    const updatedRecord = await TeaCheckInOutModel.findOneAndUpdate(
      { userId, endTime: null },
      { endTime },
      { new: true }
    );

    if (!updatedRecord) {
      return res
        .status(404)
        .json({ message: "Record not found or already checked out" });
    }

    return res.json(updatedRecord);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  checkin,
  checkout,
  leave,
  employees,
  attendance,
  Teabreakcheckin,
  Teabreakcheckout,
};
