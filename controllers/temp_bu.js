var User = require('./models/user');
var Project = require('./models/project');
var Issue = require('./models/issue');
// Let the route for the action like /:username/:project/issues 
exports.index = function (req, res) {
  var username = req.params.username;
  var project = req.params.project;

  User.findOne({username: username}).exec()
    .then(function(user){
      var result = [];
      return Project.findOne({name: project, user_id: user._id}).exec()
        .then(function(project){
          return [user, project];
        });
    })
    .then(function(result){
      var project = result[1];
      return Issues.find({project_id: project._id}).exec()
        .then(function(issues) {
          result.push(issues);
          return result;
        })
    })
    .then(function(result){
      var user = result[0];
      var project = result[1];
      var issues = result[2];

      res.render('./views/issues/index', {user: user, project: project, issues: issues});
    })
    .then(undefined, function(err){
      //Handle error
    })
}
