# Ben's Practice API 

### Contents

##### 1. Overview
##### 2. Set Up/Installation
##### 3. API Documentation
##### 4. Rate Limiting Guidelines

### 1. Overview

This API to enables users to fetch the HTML contents of a specified url.  When users submit a url to the /url endpoint, they are provided a job id and their job as added to a job queue

When users submit job_id to the /job endpoint, the HTML from the url associated with that job is retrieved.  If the url provided when the job was created is invalid or the job has not been completed yet, this will be returned instead of the HTML.

Users send GET requests to /api/url/ endpoint which returns a job_id.

Users send GET requests to /api/job which returns html of url submitted in initial request to /api/url

### 2. Set Up/Installation

1. Create a MySQL database on your server's MySQL host.  

2. Go to /server/config/env folder and rename development_placeholder.js to development.js.

2. Add in the following variables to establish connection to your newly created database:
- process.env.DB_HOSTNAME - database hostname (127.0.0.1 if locally run instance of MySQL)
- process.env.DB_USERNAME - MySQL username
- process.env.DB_PASSWORD - MySQL password
- process.env.DB_NAME - MySQL database name (probably the one you just created)

3. Open server's root file path in terminal and type 'npm install' to install the packages this module depends on

4. To start server, type 'npm start' from server's root file path.  Note: this will only work if you have nodemon installed ('npm install nodemon -save -g').  If you prefer not to use nodemon, you can start server by typing 'node server/server.js'

### 3. API Documentation

##### Create new Job

##### /api/v1/:url

Example: /api/v1/www.google.com

If the IP address has not exceeded the hourly rate limit, the response body looks like this:

```
{
  "message": "You're job has been added to the job queue.  You have 59 job request(s) remaining for this hour.",
  "job_id": "FAKEJOBID1",
  "remaining_requests": 59
}
```

- job_id can be passed into /api/v1/job/:job_id to fetch the HTML results of the url associated with the job
- remaining_requests is the number of requests you can make in the next 60 minutes before hitting the rate limit

Once you have exceeded the hourly rate limit, the response body looks like this:

```
{
  "message": "You have exceeded your rate limit, please try again at Mon Sep 14 2015 13:33:32 GMT-0700 (PDT)",
  "next_free_time": "2015-09-14T20:33:32.279Z",
  "remaining_requests": 0
}
```

- next_free_time is the time at which your current IP address is eligable to make a new request to the /api/v1/:url API endpoint

Note: url cannot start with "http://" or "https://". Valid url formats include: "www.google.com" and "google.com"



##### Get status/results of job

##### /api/v1/job/:job_id

Example: /api/v1/job/FAKEJOBID1

If the job has been completed and the url provided is valid, the response looks like this:

```
{
  "job_id": "FAKEJOBID1",
  "html": "<!DOCTYPE html><html class=\"no-js\"><head>...",
  "url": "http://www.cnn.com"
}
```

If the job has been completed but the url provided is invalid, the response looks like this:

```
{
  "job_id": "FAKEJOBID1",
  "html": "Invalid url",
  "url": "http://www.cnn.com"
}
```

If the job has not been completed yet, the response looks like this:

```
{
  "job_id": "FAKEJOBID1",
  "message": "Job has not been completed yet.  Please try again soon."
  "url": "http://www.cnn.com"
}
```

Note: the job id is provided in the response from requests made to /api/v1/:url

### 4. Rate Limiting

To prevent people from abusing the API, each IP address is limited to creating a maximum number of job requests (request to /api/v1/:url) per hour. This amount is set by the global process.env.REQUEST_LIMIT variable in the /server/config/env/development.js file. Feel free to change this variable to suite the needs of your server's usage.  The number of jobs requests remaining for a given IP address in the upcoming hour are included in the HTTP response when a new job is created.

Limited IP addresses are stored in an object in the /server/services/jobQueue.js file.  When users have zero requests remaining, their IP address is added to an object called limitedIPAddresses where the key is equal to the users' IP address and the value is the time at which they are eligible to make new job request.  When a user makes a request to /api/v1/:url, the server checks to see if the user's IP address is a key in this object.  If it isn't it means that the user is still under the limit.  If the user's IP address is a key in limitedIPAddresses, the server checks to see if the value (a time value that represents when the user is eligible to make additional requests) has already passed.  If this time is in the past, the user's IP address key value pair is removed from the object and the request is allowed.  If the IP addresses's time value is in the future, it means that the user is still subject to the rate limit.

One problem with storing this object in local memory, is that there is no persistence if the server restarts.  The job queue (which handles the processing of pending jobs) is subject to the same problem.  To solve this problem, when the server turns on, I run two functions that populate the limitedIPAddresses object with any IP addresses that are currently at the rate limit and the job queue with any pending jobs.

 