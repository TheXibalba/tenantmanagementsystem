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
app.use(express.static(__dirname+"/public"));

var date = new Date();
var dateStr = date.toString();
var end = dateStr.indexOf('GMT') - 10;
var dateWithoutTime = dateStr.substring(0, end);
var justMonth = dateStr.substring(4, 7);



app.get("/", function (req, res) {

    res.render("login");

});

let embedRent={
 month:String,
 
 paidAmount:Number,
 pendingAmount:{
     type:Number,
   default:0
 },

 rentPaymentStatus:String

};

let embedBill={

    month:String,
    prevReading:Number,
    currReading:Number,
    rpu:Number,
    takenOnDate:String,
    totalBill: Number,
    billPaymentStatus:String

}  ;

const tmsTenantSchema=new mongoose.Schema({
    flatId:Number,
    name:String,
    flatType:String,
    contact:Number,
    startingDate:Date,
    agreedUponRent:Number,

    rent:[embedRent],
    bill:[embedBill]
    });

    const Tenant=new mongoose.model("tenant",tmsTenantSchema);


app.get("/tenantRent/:ID", function (req, res) {
    const c=req.params.ID;
    
    Tenant.findOne({flatId:c},function(err,data){
        if(err){
            console.log("Error locating rent details!");
        }
        else{

            let k=0;
                Tenant.findOne({flatId:c},function(err,data1){
                    if(data1.rent.length!=0){
                     
                        k=Number(data1.rent[data1.rent.length-1].pendingAmount);

                    }
                 
                 
               
                console.log("total backlog: "+k);
                
                 
                 res.render("tenantRent", {
                tenantName:data.name,
                tenantID: data.flatId,
                receivedData:data.rent,
                fixedRent:data1.agreedUponRent,
                paidAmount:data.rent[1],
                pending: k
                



                });
                    });
           

           


            }


    });
    
    
    
  
});


app.post("/tenantRent/:ID",function(req,res){
const c=req.params.ID;

let insertRent={
month: req.body.rentMonth,
paidAmount:req.body.paidAmount,
pendingAmount: req.body.pendingRent,
rentPaymentStatus: req.body.paymentStatus
};


Tenant.updateOne({flatId:c},{$push:{rent:insertRent}},function(err,data){
    if(err){
        console.log("error updating rent details!");
    }else{
        console.log("Successfully updated the rent data! "+data);
    }
});


console.log(req.body);
res.redirect(`/tenantRent/${c}`);

});



app.get("/tenantAddTable",function(req,res){ 
    res.render("tenantAddTable");

});

    

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
               console.log("Saved successfully!: \n");
           }
       });
       const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];
  const d = new Date();
  
                                                                   
       letRentFirstObj={
           month: monthNames[d.getMonth()],
           paidAmount:agreedRent,
           pendingAmount:0,
           rentPaymentStatus: "PAID"
       };

       Tenant.updateOne({flatId:ID},{$push:{rent:rentFIrstObj}});

 
   res.redirect("/allUsers");

});





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
            res.render("allUsers",{receivedData:data});
        }
    });
   
});


app.post("/tenantBillFull/:ID", function (req, res) {
    const c=(Number)(req.params.ID);
    /* console.log(req.body); */
    let billMonth= req.body.billingMonth;
    let previousReading = Number(req.body.prevR);
    let currentReading = Number(req.body.currR);
    let ratePerUnit = Number(req.body.rate);
    let takenOn=req.body.takenOn;
    let finalBill = (currentReading - previousReading) * ratePerUnit;
    let status=req.body.paymentStatus;
//MongoDB bill saving commands

const insertBill={
    month:billMonth,
    prevReading:previousReading,
    currReading:currentReading,
    rpu:ratePerUnit,
    takenOnDate: takenOn,
    totalBill: finalBill,
    billPaymentStatus: status
};


Tenant.updateOne({flatId:c},{$push:{bill:insertBill}},function(err,data){
    if(err){
        console.log("error during updation of bill!");
    }else{
        console.log("bill successfully updated!");
    }
    res.redirect("/tenantBillFull/"+c);
}
 

);
});



app.get("/delete/:contactNo",function(req,res){
    const c=req.params.contactNo;
    /* console.log(c); */
Tenant.deleteOne({contact:c },function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Deleted Successfully!");
    }
    res.redirect("/allUsers");
});
});

app.get("/tenantBillFull/:flatIDEjs", function (req, res) {
    
    const c2=(req.params.flatIDEjs);
  /*   console.log("data type of C2: "+typeof(c2)); */
    Tenant.findOne({flatId:c2},function(err,data){
        if(err){
            console.log(err);
        }
        else{
           
            /* console.log("THE VALUE OF C2: "+c2); */
           /*  console.log(data); */
             
            res.render("tenantBillFull", {
            name:data.name,
            tenantID:data.flatId,
            receivedData:data

           } );
        }
    });
    
    
   
});



app.listen(3000, function () {
    console.log("Server started on port 3000");
});