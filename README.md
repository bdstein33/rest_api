# Ben's Practice API 


### Overview

This API to enables users to fetch the HTML contents of a specified url.  When users submit a url to the /url endpoint, they are provided a job id and their job as added to a job queue

When users submit job_id to the /job endpoint, the HTML from the url associated with that job is retrieved.  If the url provided when the job was created is invalid or the job has not been completed yet, this will be returned instead of the HTML.

Users send GET requests to /api/url/ endpoint which returns a job_id.

Users send GET requests to /api/job which returns html of url submitted in initial request to /api/url


### API Documentation

Create new Job

/api/v1/url?url=www.google.com


Get status/results of job

/api/v1/job?id=0MYJPE2L4H



### Rate Limiting

To prevent people from abusing the API, each IP address is limited to creating a maximum of 60 job requests per hour.  The number of jobs requests remaining for a given hour are included in the HTTP response when a new job is created.

 