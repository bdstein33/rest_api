var db = require('../config/db');
var Item = require('../config/schema').Item;

// Item.populate = function(itemDataArray) {
//   for (var i = 0; i < itemDataArray.length; i++) {
//     console.log(itemDataArray[i]);
//     new Item(itemDataArray[i])
//     .fetch()
//     .then(function(item) {
//       if(!item) {
//         new Item(itemDataArray[i]).save();
//       }
//     });
//   }
// };

module.exports = Item;


// Item.populate([
//   {
//     sku: "SOLO_PACK",
//     price: 14.95,
//     description: "One Pouch"
//   }
// ]);