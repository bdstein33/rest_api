# Ben's Practice API 

Please contact Ben Steinberg (bdstein33@gmail.com) with any questions.

### Contents

##### 1. Overview
##### 2. Set Up/Installation
##### 3. API Documentation
##### 4. Rate Limiting Guidelines
##### 5. Customizing Server

### 1. Overview

This API enables users to fetch the HTML contents of a specified url.  When users submit a url to the /api/v1/:url endpoint, they are provided a job id and their job is added to a job queue.

When users submit a job id to the /api/v1/job/:job_id endpoint, the HTML from the url associated with that job is retrieved.  If the url provided when the job was created is invalid or the job has not been completed yet, this will be returned instead of the HTML.

Users send GET requests to /api/v1/:url endpoint which returns a job_id.

Users send GET requests to /api/v1/job/:job_id which returns html of url submitted in initial request to /api/url

### 2. Set Up/Installation

1. Create a MySQL database on your MySQL server.  

2. Go to /server/config/env folder and rename development_placeholder.js to development.js.

2. Add in the following variables to establish connection to your newly created database:
  - process.env.DB_HOSTNAME - MySQL database hostname (127.0.0.1 if run locally)
  - process.env.DB_USERNAME - MySQL username
  - process.env.DB_PASSWORD - MySQL password
  - process.env.DB_NAME - MySQL database name (probably the one you just created)

3. Open server's root file path in terminal and type 'npm install' to install the packages this module depends on

4. To start server, type 'npm start' from server's root file path.  This will only work if you have nodemon installed ('npm install nodemon -save -g').  If you prefer not to use nodemon, you can start the server by typing 'node server/server.js'

### 3. API Documentation

##### Create new Job

##### /api/v1/:url

Example: /api/v1/www.google.com

If the IP address has not exceeded the hourly rate limit, the response body looks like this:

```
{
  "message": "You're job has been added to the job queue. You have 59 job request(s) remaining for this hour.",
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

Note: job_id is provided in the response from requests made to /api/v1/:url

### 4. Rate Limiting

To prevent people from abusing the API, each IP address is limited to creating a maximum number of job requests (requests to /api/v1/:url) per hour. This amount is set by the global process.env.REQUEST_LIMIT variable in the /server/config/env/development.js file. Feel free to change this variable to suite the needs of your server's usage.  The number of jobs requests remaining for a given IP address in the upcoming hour are included in the HTTP response when a new job is created.

IP addresses that hit the hourly rate limit are stored in an object in /server/services/jobQueue.js.  When users have zero requests remaining, their IP addresses are added to an object called limitedIPAddresses where the key is equal to the IP address and the value is the time at which new job requests can be made from the IP address.  

When a user makes a request to /api/v1/:url, the server checks to see if the user's IP address is a key in this object.  If the IP address is not a key, it means that the user is still under the limit.  If the user's IP address is a key in limitedIPAddresses, the server checks to see if the value (a time value that represents when the user is eligible to make additional requests to /api/v1/:url) has already passed.  If this time is in the past, the user's IP address key value pair is removed from the object and the request is allowed.  If the IP addresses's time value is in the future, it means that the user is still subject to the rate limit.

One problem with storing this object in local memory, is that there is no persistence if the server turns off.  The job queue (which handles the processing of pending jobs) is subject to the same problem.  To solve this issue, when the server turns on, two functions run that populate the limitedIPAddresses object with any IP addresses that are currently at the rate limit and the job queue with any incomlpete jobs.

### 5. Customizing Server

Two global variables located in /server/config/env/development.js can be modified to alter server functionality: process.env.REQUEST_LIMIT, process.env.URL_REFRESH_TIME.

To better handle traffic, I implemented rate limiting (as discussed above).  The maximum number of requests that IP addresses are allowed to make per hour is controlled by the process.env.REQUEST_LIMIT variable in the /server/config/env/development.js file.  If you change the value of this variable, you can alter the number of requests a given IP address is allowed to make.

I also implemented a minimum url refresh time, represented by process.env.URL_REFRESH_TIME.  The minimum url refresh time enables the server to process more job requests by only making a request to a pending job's url if a request has not been made to the same url within a specified number of seconds (the default is 300 seconds, or 5 minutes).  As an example, a job is created with a url of www.google.com and the HTML of this job is fetched at 3:00pm.  Another job is processed at 3:02pm (two minutes later on the same day) with the same url (www.google.com).  Since the HTML of this url has been fetched less than 300 seconds ago, the server will make the job complete without actually making a request to the job's url.  Feel free to change this variable as well.

Note: If you change these environmental variables while the server is running, I recommend restarting the server to avoid and issues.  In particular, if a user has hit the rate limit and you up the maximum number of allowable hourly requests, this user's IP address will still be a key in the limitedIPAddresses object.  