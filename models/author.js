var mongoose = require("mongoose");
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  return this.family_name + ", " + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function () {
  return (
    this.date_of_death.getYear() - this.date_of_birth.getYear()
  ).toString();
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

// Virtual for author birth date
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "Unknown";
});

// Virtual for author death date
AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "Unknown";
});

// Virtual for author date_of_birth_date
// Correct formatting for html date input.
AuthorSchema.virtual("date_of_birth_short").get(function () {
  let dateArr = DateTime.fromJSDate(this.date_of_birth)
    .toLocaleString(DateTime.DATE_SHORT)
    .split("/");
  return `${
    dateArr[2]
  }-${dateArr[0].length === 1 ? 0 + dateArr[0] : dateArr[0]}-${dateArr[1].length === 1 ? 0 + dateArr[1] : dateArr[1]}`;
});

// Virtual for author date_of_death_date
// Correct formatting for html date input.
AuthorSchema.virtual("date_of_death_short").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});

//Export model
module.exports = mongoose.model("Author", AuthorSchema);
