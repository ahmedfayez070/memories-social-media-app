const express = require("express");
const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: {
      type: [String],
      default: [],
    },
    selectedFile: String,
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PostMessage", postSchema);
