import dbConnect from "../../../utils/dbConnect";
import verifyToken from "../../../utils/verifyToken";
const User = require("../../../models/User");

dbConnect();

export default async (req, res) => {
  try {
    const result = verifyToken(req);

    if (!result) {
      return res.status(403).json({ message: "User not logged in" });
    }
    const deleteUser = await User.findByIdAndDelete(result.user.id);
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500);
  }
};
