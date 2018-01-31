let logMsg = require('../lib/utils').showMsg;
let P = new Promise((resolve, reject) => {
   logMsg('A gal infront of me is cool I have ever seen in my life.');
})

P.then(data => logMsg(data));

const posts =[{title:'I love Javascript', author:'We Bos',id:1},
              {title:'CSS', author:'We Bos',id:2},
              {title:'Dev tools tricks', author:'Chris Coyier',id:3},
              {title:'I love Javascript', author:'Addy Osmani',id:4},
              {title:'Version control system', author:'Lynda.com',id:5},];

const authors =[{name:'We Bos', twitter:'@wesbos',bio:'Canadian Developer'},
                {name:'Chris Coyier', twitter:'@chris',bio:'CSS tricks and code pen'},
                {name:'Addy Osmani', twitter:'@anddy',bio:'Cofounder for gebeya.com @ Addis Ababa'},
                {name:'Lynda.com', twitter:'@lynda',bio:'American Web technology training website'}];

//create your own function that return a post Promise
function getPostById(id){
  //var Promise = global.Promise;
  return new Promise((resovle, reject)=>{
    var post = posts.find(post=>post.id===id);
      if(post){
        resovle(post);
      }else{
        reject(Error('No post found with id '+ id));
      }
  });
}

function hydrateAuthor(post){
  return new Promise((resovle, reject)=>{
    var authorDetails = authors.find(person => person.name===post.author);
    logMsg("Check the following message from the authorDetails: ");
    logMsg("========================================");
    logMsg(authorDetails);
    logMsg("========================================");

      if(authorDetails){
        post.author=authorDetails;
        resovle(authorDetails);
      }else{
        reject(Error('can\'t find author retated to '));
      }
  });

}

getPostById(1)
.then(post => {logMsg(post);
  return hydrateAuthor(post);
})
.then(post => logMsg(post))
.catch(err => logMsg(err));
