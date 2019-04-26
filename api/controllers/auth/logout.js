module.exports = (req, res) => {
  req.session.destroy(error => {
    if (!error) {
      res.clearCookie("sid");
      res.status(200).json({success: "Cookie deleted"});
    } else {
      res.status(502).json({error: "Something went wrong!"});
    }
  });
}