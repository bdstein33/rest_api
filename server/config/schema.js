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

// Note: The first time you run the application, you might get an error: Unhandled rejection Error: ER_NO_SUCH_TABLE.  This error is raised when the application is run for the first time because it takes time for the tables to be created in the MySQL databse and the models are declared before the tables are complete.  If I put the model declarations in the .then function fo the schema definitions, other files that depend on these models will raise different errors.  Although this is not ideal, it does not cause any functionality errors and the error is not raised after tables have been created.

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

