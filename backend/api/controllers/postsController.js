const { request } = require("express");
const express = require("express");
const mongoose = require("mongoose");

const postSchema = require("../models/postMessage");

const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postSchema.findById(id);

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await postSchema.countDocuments({});

    const posts = await postSchema
      .find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await postSchema.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.status(200).json({ data: posts });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new postSchema({ ...post, creator: req.userId });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json({ message: "No post with this id" });

  const post = req.body;

  try {
    const updatedPost = await postSchema.findByIdAndUpdate(
      _id,
      { ...post, _id },
      {
        new: true,
      }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json({ message: "No post with this id" });

  try {
    const deletedPost = await postSchema.findByIdAndRemove(_id);
    res.status(200).json({ message: "post has been deleted successfully" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "No post with this id" });
  }

  const post = await postSchema.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index == -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await postSchema.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};

const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await postSchema.findById(id);

  post.comments.push(value);

  const updatedPost = await postSchema.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.status(200).json(updatedPost);
};

module.exports = {
  getPosts,
  getPost,
  getPostsBySearch,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
};
