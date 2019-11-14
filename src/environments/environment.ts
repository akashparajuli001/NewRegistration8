// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  ipUrl:'https://api.ipify.org?format=json',
   webserviceurl: 'http://localhost:8080/Services/Warranty/WarrantyService.svc/json/Execute',
 // webserviceurl: '/Services/Warranty/WarrantyService.svc/json/Execute',
  BazzarVoiceUrl: 'http://display.ugc.bazaarvoice.com/static/company/en_US/container.htm?bvaction=rr_submit_review&amp&bvproductId=item'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
