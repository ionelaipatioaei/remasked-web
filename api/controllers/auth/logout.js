module.exports = (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.json({error: "Something went wrong!"});
    }
    res.clearCookie("sid");
    res.json({success: "Cookie deleted"});
  });
}