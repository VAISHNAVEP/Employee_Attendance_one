const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CheckInOutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CheckInOutModel = mongoose.model("checkinouts", CheckInOutSchema);

module.exports = CheckInOutModel;
