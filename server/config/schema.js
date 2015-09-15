var db = require('./db');

//////////////////////////////////////////////
/// Schema Definitions
//////////////////////////////////////////////

db.knex.schema.hasTable('websites').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('websites', function(website) {
      website.increments('id').primary();
      website.string('url', 255);
      website.text('html', 'longtext');
      website.timestamp('last_updated').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log("Expected Error: ER_NO_SUCH_TABLE.  Explanation in sever/config/schema.js"); // See below
      console.log('Created Website Table');
    });
  }
});

db.knex.schema.hasTable('jobs').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('jobs', function(job) {
      job.increments('id').primary();
      job.integer('website_id', 50).unsigned().references('websites.id');
      job.string('job_id', 10);
      job.string('ip_address', 50);
      job.boolean('completed').defaultTo(false);
      job.timestamp('created_at').notNullable().defaultTo(db.knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Jobs Table');
    });
  } 
});

//////////////////////////////////////////////
/// Model Definitions
//////////////////////////////////////////////

/* 
Note: The first time you run the application, you will get an error: Unhandled rejection Error: ER_NO_SUCH_TABLE. The source of this error is the initialization section of /server/services/jobQueue.js. When the server is started, the initialization functions attempt to fetch data from the database to populate the job queue and the object that contains IP addresses that are currently at the api rate limit.  Because the tables are created asynchronously, these functions try to pull data from tabels that don't yet exist.  
Although this is not ideal, these errors don't cause any functionality errors and the error is only raised when the tables are being created.
 */

var Website = exports.Website = db.Model.extend({
  tableName: 'websites',
  job: function() {
    return this.hasMany(Job);
  }
});

var Job = exports.Job = db.Model.extend({
  tableName: 'jobs',
  website: function() {
    return this.belongsTo(Website, 'website_id');
  }
});
