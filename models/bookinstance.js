var mongoose = require("mongoose");
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, //reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
  return "/catalog/bookinstance/" + this._id;
});
// Virtual for bookinstance due_back
BookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});
// Virtual for bookinstance due_back_short
// Correct formatting for html date input.
BookInstanceSchema.virtual("due_back_short").get(function () {
  let dateArr = DateTime.fromJSDate(this.due_back)
    .toLocaleString(DateTime.DATE_SHORT)
    .split("/");
  return `${
    dateArr[2]
  }-${dateArr[0].length === 1 ? 0 + dateArr[0] : dateArr[0]}-${dateArr[1].length === 1 ? 0 + dateArr[1] : dateArr[1]}`;
});

//Export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);
