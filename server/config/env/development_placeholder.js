process.env.PORT = 8000;

// MySQL connection information
process.env.DB_HOSTNAME = 'ADD HOSTNAME';
process.env.DB_USERNAME = 'ADD USERNAME';
process.env.DB_PASSWORD = 'ADD USERNAME';
process.env.DB_PORT = 3306;
process.env.DB_NAME = 'ADD DATABASE NAME';

// Max number of requests that can be made from a single IP address in an hour
process.env.REQUEST_LIMIT = 60;

/* URL_REFRESH_TIME is the time difference (in seconds) after which a new request will be made for a site's HTML

Example if URL+REFRESH_TIME = 60 * 60: User 1 makes a job for http://google.com and server requests HTML at 1pm.  If another user makes a job request to the same url before 2:00pm, rather then fetching the HTML again, we will return the previously fetched HTML.

Having a minimum refresh time helps ensure that we won't hit rate limits of other APIs.*/
process.env.URL_REFRESH_TIME = 60 * 5;

// Limits the max number of bytes a string can be from downloaded file before request is terminated
process.env.MAX_FILE_SIZE = 10000000;
// 1000000000B = 1 GB
// 1000000B = 1 MB
// 1000B = 1 KB