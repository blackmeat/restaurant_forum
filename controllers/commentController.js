const db = require("../models")
const Comment = db.Comment
const commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurandId,
      UserId: req.user.id
    })
      .then((comment) => {
        res.redirect(`/restaurant/${req.body.restaurandId}`)
      })
  }
}
module.exports = commentController