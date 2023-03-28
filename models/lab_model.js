const mongoose = require("mongoose");

const LabSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    docs: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "labs",
    versionKey: false,
  }
);

const LabModel = mongoose.model("lab", LabSchema);

exports.LabModel = LabModel;
