//jshint esversion:6
const md5=require("md5");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const mongoose=require("mongoose");
const moment = require('moment');

mongoose.connect("mongodb://localhost:27017/TMStenants",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.set('useFindAndModify', false);
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

let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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
    paidOnDate:Date,
    rentPaymentStatus:String

};

let embedBill={

    month:String,
    prevReading:Number,
    currReading:Number,
    rpu:Number,
    takenOnDate:String,
    totalBill: Number,
    previousDues:{
       type: Number,
       default:0
    },
    billPaymentStatus:String

}  ;

const tmsTenantSchema=new mongoose.Schema({
    flatId:Number,
    name:String,
    govIdentification:String,
    flatType:String,
    contact:Number,
    startingDate:String,
    agreedUponRent:Number,

    rent:[embedRent],
    bill:[embedBill],
    uniqueTenantKey:Number
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

                    let rentData=data.rent;
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
const tempDate=new Date(req.body.paidOnDate);
const r=tempDate.toLocaleDateString("en-US",options);
/* console.log(req.body.paymentStatus); */
let insertRent={
month: req.body.rentMonth,
paidAmount:req.body.paidAmount,
pendingAmount: req.body.pendingRent,
paidOnDate:tempDate,
rentPaymentStatus: req.body.paymentStatus
};



Tenant.updateOne({flatId:c},{$push:{rent:insertRent}},function(err,data){
    if(err){
        console.log("error updating rent details!");
    }else{
        console.log("Successfully updated the rent data! ");
    }
});


/* console.log(req.body); */
res.redirect(`/tenantRent/${c}`);

});

app.get("/tenantRent/delete/:ID/:month",function(req,res){
    const ID=Number(req.params.ID);
    const delMonth=req.params.month;
    Tenant.findOneAndUpdate({flatId:ID},{$pull:{rent:{month:delMonth}}},{new:true},function(err){
            if(!err){
                console.log("deleted month rent successfully!");
            }else{
                res.send("ERROR Deleting the rent!");
            }
            res.redirect(`/tenantRent/${ID}`);
    });



    
   
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
    let govId;
    
    let rand=Math.floor(Math.random()*(Math.pow(10,10)));


    ID=req.body.ID;
    newUser=req.body.newTenantName;
    /* console.log("new user1: "+req.body.newTenantName); */
    govId=req.body.govId;
    flat_type=req.body.newFlatType;
   /*  console.log("new user2: "+req.body.newFlatType); */
    contact_no=req.body.newContact;
    /* console.log("new user3: "+req.body.newContact); */

    let tempDate=new Date(req.body.allocationDate);
    flatAllocationDate=tempDate.toLocaleDateString("en-US",options);
    console.log(flatAllocationDate.toString());
    agreedRent=req.body.rentAmount;

    
       const newTenant=new Tenant({
           flatId:ID,
           name:newUser,
           govIdentification:govId,
           flatType:flat_type,
           contact:contact_no,
           startingDate:flatAllocationDate,
           agreedUponRent:agreedRent,
           uniqueTenantKey:rand

       });
       /*  console.log(newTenant);
       console.log(req.body);  */
       newTenant.save(function(err,tenant){
           if(err){
               console.log(err);
           }else{
               console.log("Tenant Created Successfully!");

               res.render("displayUniqueKey",{
               uniqueKey: tenant.uniqueTenantKey
            });
         
           }
       });
  
                                                                   
     /*   letRentFirstObj={
           month: monthNames[d.getMonth()],
           paidAmount:agreedRent,
           pendingAmount:0,
           rentPaymentStatus: "PAID"
       };

       Tenant.updateOne({flatId:ID},{$push:{rent:rentFIrstObj}});
 */
 
 
});





app.post("/", function (req, res) {
  
    adminName=req.body.username;
    adminPass=req.body.password;
  
   
    Admin.findOne({username:adminName},function(err,data){
        if(!err){
            if(data.password===adminPass){
            
            res.redirect("/allUsers");
           
            }else{
                
                res.send("The Username or the Password is INVALID!");
            }
        }else{
            console.log(err);
            res.send("ERROR!");
        }
    });



});
app.get("/allUsers", function (req, res) {    
    Tenant.find({},function(err,data) {
        if(err){
            console.log(err);
        }else{
           /*  console.log(data); */
            res.render("allUsers",{receivedData:data});
        }
   
}).sort({flatId: 1});
});

app.post("/tenantBillFull/:ID", function (req, res) {
    const c=(Number)(req.params.ID);
    /* console.log(req.body); */
    let billMonth= req.body.billingMonth;
    let previousReading = Number(req.body.prevR);
    let currentReading = Number(req.body.currR);
    let ratePerUnit = Number(req.body.rate);
    let takenOn=req.body.takenOn;
    let dues=req.body.dues;

    Tenant.findOne({flatId:c},function(err,data){

    });


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
    /* previousDues: */
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



app.get("/delete/:flatNo",function(req,res){
    const c=req.params.flatNo;

    Tenant.findOne({flatId:c},function(err,data){
        if(!err){
            
    res.render(`deleteWarn`,{
        name:data.name,
        flatID: data.flatId
    });
        }
    });


  

});

app.post("/deleteWarn/:flatNo",function(req,res){
    const c=req.params.flatNo;
    let key=Number(req.body.uniqueKey);



    Tenant.findOne({flatId:c},function(err,data){
        if(!err){


            if(key===data.uniqueTenantKey){

                Tenant.deleteOne({flatId:c },function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Deleted Successfully!");
                        res.redirect("/allUsers");
                    }

            });


        }else{
            res.send("The Unique key was invalid!");
        }
        
    }else{

        console.log(err);
    }
        
        
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
            let k1=0;
            Tenant.findOne({flatId:c2},function(err,data1){
                if(data1.bill.length!=0){
                 
                    k1=Number(data1.bill[data1.bill.length-1].previousDues);
        
                }
            });
        
           
            /* console.log("THE VALUE OF C2: "+c2); */
           /*  console.log(data); */
             
            res.render("tenantBillFull", {
            name:data.name,
            tenantID:data.flatId,
            receivedData:data,
            k:k1

           } );
        }
    });
    
    
   
});

app.get("/contact",function(req,res){
    res.render("contact");
});

app.post("/contact",function(req,res){
    console.log(req.body);
    res.send("Thank you for the message, you will receive the reply within the next working day!");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});