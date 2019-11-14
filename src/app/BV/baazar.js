
// export function feedBazaarToSendEmail(bazarData){
  
//       $BV.SI.trackTransactionPageView({
//          "orderId" : bazarData.orderId,
//          "city" : bazarData.city,
//          "state" : bazarData.state,
//          "country" :bazarData.country,
//          "currency" : "USD",
//          "nickname" : bazarData.nickname,
//          "items" : bazarData.items,
//          "email" : bazarData.email,
//          "total": bazarData.total
        
//        });

//     console.log("Done sending email to Baazar");
// }

 export function feedBazaarToSendEmail(bazarData){


   BV.pixel.trackTransaction({
         "orderId" : bazarData.orderId,
         "city" : bazarData.city,
         "state" : bazarData.state,
         "country" :bazarData.country,
         "currency" : "USD",
         "nickname" : bazarData.nickname,
         "email" : bazarData.email,
         "total": bazarData.total,

     "items" : bazarData.items

   });

   }
 