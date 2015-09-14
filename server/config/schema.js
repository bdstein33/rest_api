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