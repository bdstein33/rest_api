var Customer = require('../models/customer.model');

var fs = require('fs');
var parse = require('csv-parse');

var results = []
var first_name_col = 1;
var last_name_col = 3;
var email_col = 5;
var company_col = 29;
var job_title_col = 31

var parser = parse({delimiter: ','}, function(err, data) {
  var data = [];

  for (var i = 1; i < data.length - 1; i++) {
    var searchText = ["linkedin"];
    searchText.push(data[i][first_name_col]);
    searchText.push(data[i][last_name_col]);
    // searchText.push(data[i][email_col]);
    searchText.push(data[i][company_col]);
    searchText.push(data[i][job_title_col]);
    console.log(searchText.join(" "));
  }


  
});

fs.createReadStream(__dirname + '/data.csv').pipe(parser);


var parseOrderItem = function(req, res) {

  // CUSTOMER DATA COLUMNS
  var olx_customer_id_col = 26;
  var first_name_col = 16;
  var last_name_col = 17;
  var email_col = 37;
  var address_1_col = 30;
  var address_2_col = 31;
  var city_col = 32;
  var state_col = 33;
  var zip_code_col = 34;
  var country_col = 35;

  // ORDER DATA COLUMNS
  var olx_order_id_col = 47;
  var date_col = 45;
  var price_col = 58;
  var shipping_col = 59;
  var tax_col = 60;
  var total_col = 61;
  var status_col = 62;
  var pay_type_col = 49;

  // ORDER ITEM DATA COLUMNS
  var sku_col = 56;
  var quantity_col = 57;

  //START PROCESSING DATA ON ROW THREE BECAUSE FIRST TWO ROWS ARE HEADERS
  var row_num = 3;



}