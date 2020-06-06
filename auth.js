//jshint esversion:6
const jwt=require("jsonwebtoken");
require('dotenv').config();

module.exports=(req,res,next)=>{

try{

const authCodeFromCookie= (req.headers.cookie.split(";")[0]).split("=")[1];
/* console.log(authCodeFromCookie); */

jwt.verify(authCodeFromCookie,process.env.COOKIE_SECRET);
req.authenticated="TRUE";
}catch(error){
   req.authenticated="FALSE";
 
   return res.status(401).cookie("authCookie","",{maxAge:0}).send("<h1>Unauthorized!</h1>");
   
}   
    
next();


};