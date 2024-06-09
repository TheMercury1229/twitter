import jwt from "jsonwebtoken";
export const generateTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    httpOnly: true, //Prevents XSS attacks
    sameSite: "strict", //CSRF attack
    secure: process.env.NODE_ENV !== "development",
  });
};
