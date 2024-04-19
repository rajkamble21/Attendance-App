
const verifyAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user && req.user.isadmin) {
        next();
    } else {
        res.status(403).json({ message: "Unauthorized access. Admin privileges required." });
    }
};

module.exports = verifyAdmin;
