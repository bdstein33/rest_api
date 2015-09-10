var db = require('./db');

// Schema construction
db.knex.schema.hasTable('customers').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('customers', function(customer) {
      customer.increments('id').primary();
      customer.string('olx_customer_id', 10);
      customer.string('first_name', 50);
      customer.string('last_name', 50);
      customer.string('email', 50);
      customer.string('address_1', 100);
      customer.string('address_2', 100);
      customer.string('city', 50);
      customer.string('state', 2);
      customer.string('zip_code', 5);
      customer.date('date_acquired');
      customer.boolean('subscriber').defaultTo(false);
      customer.date('next_ship_date');
    }).then(function(table) {
      console.log('Created Customer Table');

    });
  }
});

db.knex.schema.hasTable('items').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('items', function(item) {
      item.increments('id').primary();
      item.string('sku', 75);
      item.decimal('price', 4, 2);
      item.string('description', 125);
    }).then(function(table) {
      console.log('Created Items Table');
      new Item({
        sku: "SOLO_PACK",
        price: 14.95,
        description: "One Pouch"
      }).save();
      new Item({
        sku: "1MO",
        price: 34.95,
        description: "One Month Bundle"
      }).save();
      new Item({
        sku: "1MOCTY",
        price: 31.46,
        description: "One Month Bundle Continuity"
      }).save();
      new Item({
        sku: "3MO",
        price: 89.95,
        description: "Three Month Bundle"
      }).save();
      new Item({
        sku: "3MOCTY",
        price: 80.96,
        description: "Three Month Bundle Continuity"
      }).save();
      new Item({
        sku: "CHOC_MINT",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "CHOC_MINTCTY-1MO",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "CHOC_MINTCTY-3MO",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "CINN",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "CINNCTY-1MO",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "CINNCTY-3MO",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "CITR",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "CITRCTY-1MO",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "CITRCTY-3MO",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "MOCH",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "MOCHCTY-1MO",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "MOCHCTY-3MO",
        price: 0.00,
        description: "Chocolate Mint Pouch"
      }).save();
      new Item({
        sku: "CHOC-4",
        price: 0.00,
        description: "4-Piece Sample Pack"
      }).save();
      new Item({
        sku: "CONSUMER_SAMPLE_PACK",
        price: 0.00,
        description: "Consumer Sample Pack"
      }).save();
    });  
  }
});

db.knex.schema.hasTable('orders').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('orders', function(order) {
      order.increments('id').primary();
      order.integer('customer_id', 50).unsigned().references('customers.id');
      order.string('olx_order_id', 10);
      order.date('date');
      order.integer('amount');
      order.integer('shipping');
      order.integer('tax');
      order.string('status', 25);
      order.string('discount_code', 50);
    }).then(function(table) {
      console.log('Created Order Table');
    });
  }
});


db.knex.schema.hasTable('order_items').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('order_items', function(order_item) {
      order_item.increments('id').primary();
      order_item.integer('order_id', 50).unsigned().references('orders.id');
      order_item.integer('item_id', 50).unsigned().references('items.id');
      order_item.integer('quantity');
    }).then(function(table) {
      console.log('Created Order Items Table');
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function(user) {
      user.increments('id').primary();
      user.string('first_name', 75);
      user.string('last_name', 75);
      user.string('email', 75);
      user.string('password', 75);
      user.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Users Table');
    });
  }
});

// Model declaration
var Customer = exports.Customer = db.Model.extend({
  tableName: 'customers',
  order: function() {
    return this.hasMany(Order);
  }
});

var Item = exports.Item = db.Model.extend({
  tableName: 'items',
  order_item: function() {
    return this.hasMany(OrderItem);
  }
});

var Order = exports.Order = db.Model.extend({
  tableName: 'orders',
  customer_id: function() {
    return this.belongsTo(Customer, 'customer_id');
  },
  order_item: function() {
    return this.hasMany(OrderItem);
  }
});


var OrderItem = exports.OrderItem = db.Model.extend({
  tableName: 'order_items',
  order_id: function() {
    return this.belongsTo(Order, 'order_id');
  },
  item_id: function() {
    return this.belongsTo(Item, 'item_id');
  }
});

var User = exports.User = db.Model.extend({
  tableName: 'users'
});

