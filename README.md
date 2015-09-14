# Ben's Practice API 


### Overview

This API to enables users to fetch the HTML contents of a specified url.  When users submit a url to the /url endpoint, they are provided a job id and their job as added to a job queue

When users submit job_id to the /job endpoint, the HTML from the url associated with that job is retrieved.  If the url provided when the job was created is invalid or the job has not been completed yet, this will be returned instead of the HTML.

Users send GET requests to /api/url/ endpoint which returns a job_id.

Users send GET requests to /api/job which returns html of url submitted in initial request to /api/url


### API Documentation

#### Create new Job

#### /api/v1/:url

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



#### Get status/results of job

#### /api/v1/job/:job_id

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
  "message": "Job  has not been completed yet.  Please try again soon."
  "url": "http://www.cnn.com"
}
```

Note: the job id is provided in the response from requests made to /api/v1/:url


### Rate Limiting

To prevent people from abusing the API, each IP address is limited to creating a maximum of 60 job requests per hour.  The number of jobs requests remaining for a given hour are included in the HTTP response when a new job is created.

 