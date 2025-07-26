import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    // get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized - Token missing", success: false });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach the userId to request
    req.id = decoded.userId;

    next();
  } catch (error) {
    console.log("Error in isAuthenticated middleware", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
