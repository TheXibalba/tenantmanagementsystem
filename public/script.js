//jshint esversion:6

console.log("javascript is running fine!");



$(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });


  let fixedRent=document.getElementById("fixedRent");
  let paidAmount=document.getElementById("paidAmount");
  let pendingRent=document.getElementById("pendingRent");
  let pa=document.getElementById("pa").lastChild;
  let total=0;
  let flag=0;

  console.log(fixedRent,paidAmount,pendingRent);


   
  paidAmount.addEventListener("change",function(event){
    
  /*  if(Number(paidAmount.value)>(Number()+Number())) */



     pendingRent.value= Number(fixedRent.value)-Number(paidAmount.value);
      
     
   
  });


  
   total=Number(pendingRent.value)+Number(fixedRent.value); 
  paidAmount.setAttribute("placeholder","Total: "+total);
  
   

  
