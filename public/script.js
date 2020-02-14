//jshint esversion:6

console.log("javascript is running fine!");



$(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });


  let fixedRent=document.getElementById("fixedRent");
  let paidAmount=document.getElementById("paidAmount");
  let pendingRentForm=document.getElementById("pendingRent");
  let pa=document.getElementsByClassName("pa");
  let rentMonth=document.getElementById("rentMonth");
  let total=0;
  let temp=0;



if(pa.length!=0){
temp=(Number((pa[pa.length-1]).innerHTML));
}
  paidAmount.addEventListener("change",function(event){
     pendingRent.value= temp+Number(fixedRent.value)-Number(paidAmount.value);  
  });
  
   total=Number(pendingRent.value)+Number(fixedRent.value); 
   paidAmount.setAttribute("placeholder","Total: "+total);
  

  




 
