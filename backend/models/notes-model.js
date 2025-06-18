const {Schema,model, default: mongoose} = require("mongoose");

const notesSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique:true,
  },
  content: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }

},{timestamps:true});

const notesModel = model("notes", notesSchema)

module.exports = notesModel