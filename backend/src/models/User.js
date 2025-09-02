import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  totalQuizzes: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 }, // percentage
  streaks: { type: Number, default: 0 },
  rating: { type: Number, default: 1000 }, // ELO-like rating
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    stats: {
      type: statsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Optional: helper method to hide sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
