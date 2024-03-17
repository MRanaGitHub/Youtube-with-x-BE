import mongoose, { Schema } from "mongoose";

const tweetScheema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Tweet = mongoose("Tweet", tweetScheema);
