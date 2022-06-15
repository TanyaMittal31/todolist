const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const da = require(__dirname + "/day.js");
const mongoose = require("mongoose");
const _ = require("lodash");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));    // css files ko load krne ke liye
// const items = [];
// const works = [];

mongoose.connect("mongodb+srv://tanya:2134@cluster0.n1fmm.mongodb.net/?retryWrites=true&w=majority" , {useNewUrlParser : true});

// create schema
const listItem = {
  name : String,
}

// schema for dynamic routes
const listSchema = {
  name : String,
  items : [listItem]
}

// create mongoose model
const Item = mongoose.model(
  "Item",listItem
);

// model for dynnamic routes
const list = mongoose.model(
  "list",listSchema
)

const item1 = new Item({
  name : "welcome to todo list"
})

const item2 = new Item({
  name : "click on + button to add new items"
})

const defaultItem = [item1,item2];

Item.insertMany(defaultItem,function(err){
  if(err){
    console.log(err);
  }else{
    console.log("saved successfully");
  }
})

app.get("/", function (req, res) {
  // res.send("hello");
  // var today = new Date();
  // var currentDay = today.getDay();
  // console.log(today);
  // console.log(currentDay);
  /*
    var date = "";
    if(currentDay === 0 || currentDay === 6){
        date = "weekend";
    }else{
        date = "weekday";
    }
    res.render("day", {kindOfDay : date});
    */
   /*
  switch (currentDay) {
    case 0:
      currentDay = "Sunday";
      break;
    case 1:
      currentDay = "Monday";
      break;
    case 2:
      currentDay = "Tuesday";
      break;
    case 3:
      currentDay = "Wednesday";
      break;
    case 4:
      currentDay = "Thursday";
      break;
    case 5:
      currentDay = "Friday";
      break;
    case 6:
      currentDay = "Saturday";
      break;
    default : 
        console.log("error");
  }
  res.render("day",{kindOfDay : currentDay});

*/
let day = da.getDate();

Item.find({},function(err,foundItems){
  if(foundItems.length === 0){
    Item.insertMany(defaultItem , function(err){
      if(err){
        console.log(err);
      }else{
        console.log("saved sucessfully");
      }
    });
    res.redirect("/");
  }else{
    res.render("day",{listTitle : day , newItems : foundItems }); 
  }
});

});

app.post('/',function(req,res){
    const item = req.body.item;
    const listName = req.body.list;
    /*console.log(req.body);
    if(req.body.list === "today's"){
      works.push(item);
      res.redirect("/work");
    }else{
      items.push(item);
      res.redirect("/");      //redirect ke through hum vaapas get method ke ps jayenge
    }
    // console.log(item);*/

    const iteNew = new Item({
      name : item
    })

    if(listName === da.getDate()){
      iteNew.save();
      res.redirect("/");
    }else{
      list.findOne({name : listName}, function(err,foundList){
        foundList.items.push(iteNew);
        foundList.save();
        res.redirect("/"+listName);
      })
    }

    
});

app.post("/delete" , function(req,res){
  // console.log(req.body.checkbox);
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === da.getDate()){
    Item.findByIdAndRemove(checkedItem,function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("success");
        res.redirect("/");
      }
    });
  } else{
    list.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    })
  }
  
});

app.get("/:title", function(req,res){
  const titleName = _.capitalize(req.params.title);

  list.findOne({name : titleName}, function(err, foundList){
    if(!err){
      if(!foundList){
        // create a new list
        const litem = new list({
          name: titleName,
          items : defaultItem
        });
        litem.save();
        res.redirect("/"+titleName);
      } else{
        res.render("day", {listTitle : foundList.name , newItems : foundList.items} );
      }
    }
    else{
      console.log(err);
    }
  });
  
});

app.get('/work' , function(req,res){
  res.render("day", {listTitle : "today's work" , newItems : works} );
});

app.get("/about" , function(req,res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server listening on port 3000");
});
