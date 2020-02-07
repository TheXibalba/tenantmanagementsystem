//jshint esversion:6
const md5=require("md5");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const mongoose=require("mongoose");
const moment = require('moment');

mongoose.connect("mongodb://localhost:27017/TMStenants",{useNewUrlParser:true,useUnifiedTopology:true});

const tmsAdminSchema=new mongoose.Schema({
    username:String,
    password:String
});

    const Admin=new mongoose.model("admin",tmsAdminSchema);
    const newAdmin=new Admin({
    username:"yurajpawar99@gmail.com",
    password:"123"
});
 
/* newAdmin.save(function(err){
 if(err){
     console.log(err);
 }else{
     console.log("admin has been created successfully!");
 }
}); */



app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var date = new Date();
var dateStr = date.toString();
var end = dateStr.indexOf('GMT') - 10;
var dateWithoutTime = dateStr.substring(0, end);
var justMonth = dateStr.substring(4, 7);



app.get("/", function (req, res) {

    res.render("login");

});


app.get("/tenantRent", function (req, res) {
    res.render("tenantRent", {
        tenantID: "01",
        tenantName: "some Tenant",
        flatType: "Some flat",
        rentAmount: 1000,
        month: "some month"
    });
});
app.get("/tenantBill", function (req, res) {
    res.render("tenantBill", {
        tenantID: "01",
        tenantName: "some Tenant",
        billAmount: 1000,
        month: justMonth
    });

});
app.get("/tenantBillFull", function (req, res) {
    res.render("tenantBillFull", {
        tenantID: "01",
        tenantName: "some Tenant",
        month: "Some Month",
        prevREjs: 1000,
        currREjs: 2000,
        rateEjs: 10.22,
        dateEjs: "some date",
        billOfMonth: 1212,
        paymentStatus: "Don't know"

    });
});

app.get("/tenantAddTable",function(req,res){ 
    res.render("tenantAddTable");

});

const tmsTenantSchema=new mongoose.Schema({
    flatId:Number,
    name:String,
    flatType:String,
    contact:Number,
    startingDate:Date,
    agreedUponRent:Number,
    });

    const Tenant=new mongoose.model("tenant",tmsTenantSchema);


app.post("/tenantAddTable",function(req,res){
    /* database commands go here */
    let newUser;
    let flat_type;
    let contact_no;
    let agreedRent;
    let ID;
    let flatAllocationDate;
    
    ID=req.body.ID;
    newUser=req.body.newTenantName;
    /* console.log("new user1: "+req.body.newTenantName); */
    
    flat_type=req.body.newFlatType;
   /*  console.log("new user2: "+req.body.newFlatType); */
    contact_no=req.body.newContact;
    /* console.log("new user3: "+req.body.newContact); */
    flatAllocationDate=req.body.allocationDate;
    agreedRent=req.body.rentAmount;

    
       const newTenant=new Tenant({
           flatId:ID,
           name:newUser,
           flatType:flat_type,
           contact:contact_no,
           startingDate:flatAllocationDate,
           agreedUponRent:agreedRent

       });
       /*  console.log(newTenant);
       console.log(req.body);  */
       newTenant.save(function(err,tenant){
           if(err){
               console.log(err);
           }else{
               console.log("Saved successfully!: \n"+tenant);
           }
       });

 
   res.redirect("/allUsers");

});



var previousReading;
var currentReading;
var ratePerUnit;
var finalBill;


app.post("/", function (req, res) {
  
    adminName=req.body.username;
    adminPass=req.body.password;
   
  /*  if(adminName==="yurajpawar99@gmail.com" && adminPass==="123"){
       res.render("allUsers",{ID:01,newUser:"some user"});

   }else{
    res.send("ERROR!");
   } */
   
    Admin.findOne({username:adminName,password:adminPass},function(err){
        if(err){
            console.log(err);
            res.send("ERROR!");
        }else{
            res.redirect("allUsers");
        }
    });



});
app.get("/allUsers", function (req, res) {    
    Tenant.find({},function(err,data){
        if(err){
            console.log(err);
        }else{
           /*  console.log(data); */
            res.render("allUsers",{ID:101,receivedData:data});
        }
    });
   
});


app.post("/tenantBill", function (req, res) {
    console.log(req.body);
    previousReading = Number(req.body.prevR);
    currentReading = Number(req.body.currR);
    ratePerUnit = Number(req.body.rate);
    finalBill = (currentReading - previousReading) * ratePerUnit;

});



app.get("/delete/:contactNo",function(req,res){
    const c=req.params.contactNo;
    console.log(c);
Tenant.deleteOne({contact:c },function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Deleted Successfully!");
    }
    res.redirect("/allUsers");
});
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});