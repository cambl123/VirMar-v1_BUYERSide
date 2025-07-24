// This is a conceptual middleware. You need to implement it based on your token structure.
// It should typically decode the token and check the user's role.

const protectAdminRoute = (req, res, next) => {
  // Assuming your authentication middleware (e.g., protectBuyerRoute or protectSellerRoute)
  // has already populated req.user or req.seller with user/seller details including role.
  // Or, you might have a separate generic authentication middleware that populates req.auth.user.

  // For simplicity, let's assume req.user is populated by a generic auth middleware
  // and it contains a 'role' field.
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

export default protectAdminRoute;