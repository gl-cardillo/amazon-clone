const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  cart: { type: Array },
  city: { type: String },
  dateOfBirth: { type: Date },
  postcode: { type: String },
  address: {type: String}
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

UserSchema.virtual("dateOfBirth_formatted").get(function () {
  return DateTime.fromJSDate(this.dateOfBirth).toLocaleString(
    DateTime.DATE_SHORT
  );
});

UserSchema.virtual("dateOfBirth_toISODate").get(function () {
  return DateTime.fromJSDate(this.dateOfBirth).toISODate();
});

UserSchema.virtual("firstName").get(function () {
  return this.name.split(' ')[0]
});


module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
