const mongoose = require('mongoose');

// Define the User Schema with just the name field
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      unique: true,
    },
    score: {
        type: Number,
        required: [true, 'Score is required'],
      }
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);
// Export the model
module.exports = mongoose.model('User', UserSchema);
