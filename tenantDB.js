//jshint esversion:6
const md5=require("md5");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/TMStenants",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Connected successfully!");
    }
});

const tmsTenantSchema=new mongoose.Schema({


tenantMain:[
{name:String},
{flatType:String},
{rentPerMonth:Number}],

tenantRentDetails:[
    {month:String},
    {rentPaymentStatus:String}
],

tenantBillDetails:[ 
    {dbPreviousReading:Number},
    {dbCurrentReading:Number },
    {dbRatePerUnit:Number },
    {dbTakenDate:Date },
    { billPaymentStatus:String}
]

});

const tmsAdminSchema=new mongoose.Schema({
    username:String,
    password:String
});

const Admin=new mongoose.model("admin",tmsAdminSchema);
const Tenant=new mongoose.model("tenant",tmsTenantSchema);
/* 
const newAdmin=new Admin({
    username:"yurajpawar99@gmail.com",
    password:"123"
});

newAdmin.save(function(err){
 if(err){
     console.log(err);
 }else{
     console.log("admin has been created successfully!");
 }
}); */

const newTenant= new Tenant({
    tenantMain:[
        {name:"Yuvraj Pawar"},
        {flatType: "2 BHK"},
        {rentPerMonth: 10000}],
        
         tenantRentDetails:[
            {month:"Some month"},
            {rentPaymentStatus: "paid/unpaid"}
        ],
        /*
        tenantBillDetails:[ 
            {dbPreviousReading:Number},
            {dbCurrentReading:Number },
            {dbRatePerUnit:Number },
            {dbTakenDate:Date },
            { billPaymentStatus:String}
        ]
         */
});
/* 
newTenant.save(function(err){
    if(err){
        console.log(err)
        ;
    }
    else{
        console.log("saved!");
    }
}); */

Tenant.find({_id:"5dfa552811f66713c46011e2"},function(err,doc){
    if(err){
        console.log(err);
    }else{
        console.log(doc);
    }
});

app.listen(3000,function(){
    console.log("Server is running on port 3000!");
});