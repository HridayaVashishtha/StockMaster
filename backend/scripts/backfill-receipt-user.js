import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stockmaster";

const run = async () => {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/backfill-receipt-user.js <user-email>");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const User = mongoose.model("User", new mongoose.Schema({ email: String }), "users");
  const Receipt = mongoose.model(
    "Receipt",
    new mongoose.Schema({ user: mongoose.Schema.Types.ObjectId }, { strict: false }),
    "receipts"
  );

  const user = await User.findOne({ email });
  if (!user) {
    console.error("User not found for email:", email);
    process.exit(1);
  }

  const res = await Receipt.updateMany(
    { $or: [{ user: { $exists: false } }, { user: null }] },
    { $set: { user: user._id } }
  );

  console.log(`Updated ${res.modifiedCount} receipts to user ${user._id}`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});