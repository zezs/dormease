const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
   body: String,
   rating: Number,
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User' // refer to USer model
  },
});


module.exports = mongoose.model("Comment", commentSchema);