const express= require("express");
const bodyparser= require("body-parser");
const mongoose= require("mongoose");
const date= require(__dirname + "/date.js");
// console.log(date);
const app= express();


// var items=["Study C++",
//  "Get Web Development Internship soon",
// "Make Good Projects"];

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://shreya____12:Pin%40201012@atlascluster.cdxagio.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemschema= {
    name: String
};

const Item= mongoose.model("Item",itemschema)

const item1= new Item({
    name: "Welcome to do your to do list!"
});

const item2= new Item({
    name: "Hit the + to add a new thing to your to-do list"
});

const item3= new Item({
    name: "<--Hit the  button to remove item"
});

const defaultitems = [item1, item2,item3];




app.get("/", function(req, res)
{
    let day= date();


    Item.find({}, function(err, foundItems){
    
        if(foundItems.length==0)
        {
            Item.insertMany(defaultitems, function(err){
                if(err) {console.log(err); }
                else{
                     console.log("Sucessfully saved default items to the list");
                }
                    });
                    res.redirect("/");
        }

        else{
     res.render("list", {kindOfDay: day, newListItems: foundItems});
        }
    });




});


app.post("/", function(req,res)
{
var itemName= req.body.newItem;
const item= new Item({
    name:itemName
});
item.save();
res.redirect("/");

});


app.post("/delete", function(req,res)
{
    const checkedItemId= (req.body.checkbox);
    Item.findByIdAndRemove(checkedItemId, function(err)
    {
        if(!err)
        {
            console.log("Succesfully deleted the checked item");
        res.redirect("/");
        }
    });
});


let port= process.env.PORT;
if(port==null ||port=="")
{
    port= 3000;
}

app.listen(port, function(){
console.log("Server has started successfully");
});
