//jshint esversion:6

console.log("javascript is running fine!");



$(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });


  let fixedRent=document.getElementById("fixedRent");
  let paidAmount=document.getElementById("paidAmount");
  let pendingRentForm=document.getElementById("pendingRent");
  let pendingAmount=document.getElementsByClassName("pa");
  let rentMonth=document.getElementById("rentMonth");
  let total=0;
  let temp=0;
let rentPaymentStatus=document.getElementById("rentPaymentStatus");


if(pendingAmount.length!=0){
temp=(Number(((pendingAmount[pendingAmount.length-1]).innerHTML).split(" ")[1]));
}
  paidAmount.addEventListener("change",function(event){
     pendingRent.value= temp+Number(fixedRent.value)-Number(paidAmount.value);  

     if(Number(pendingRent.value)<0){
     alert("Please check the paid amount");
  
     }
  });
  
   total=Number(pendingRent.value)+Number(fixedRent.value); 
   paidAmount.setAttribute("placeholder","Total: "+total);
  

  

   
 



 
   