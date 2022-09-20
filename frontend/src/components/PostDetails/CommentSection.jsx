import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import useStyles from "./styles";

import { Typography, Button, TextField } from "@material-ui/core";

import { commentPost } from "../../actions/posts";

export default function CommentSection({ post }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const commentsRef = useRef();
  const user = JSON.parse(localStorage.getItem("profile"));

  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");

  const handleSubmitComment = async () => {
    const finaleComment = `${user.result.name}: ${comment}`;
    const newComments = await dispatch(commentPost(finaleComment, post._id));

    setComments(newComments);
    setComment("");

    commentsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {comments.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              <strong>{c.split(": ")[0]}</strong>: {c.split(":")[1]}
            </Typography>
          ))}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && (
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="h6">
              Write a comment
            </Typography>
            <TextField
              fullWidth
              minRows={4}
              variant="outlined"
              label="Comment"
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              style={{ marginTop: "10px" }}
              color="primary"
              fullWidth
              disabled={!comment}
              variant="contained"
              onClick={handleSubmitComment}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
