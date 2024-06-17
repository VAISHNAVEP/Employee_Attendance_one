const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeaCheckInOutSchema = new Schema(
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

const TeaCheckInOutModel = mongoose.model("Teabreakcheckinouts", TeaCheckInOutSchema);

module.exports = TeaCheckInOutModel;
