//import page from "lodash"

 Template.pdfTest.onCreated(()=>{
   //  console.log(page);
 });

Template.pdfTest.events({
    'click .myButton': function() {
        // Define the pdf-document
        // var docDefinition = { content: 'My Text' };
        //
        // // Start the pdf-generation process
        // pdfMake.createPdf(docDefinition).open();
        Meteor.pdf.save('<style>h1{color:"red";}</style><h1>Test facture in pdf</h1>', 'myFileName.pdf');

    }
});
