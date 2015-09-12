# Ben's Practice API 


### Overview

Users send GET requests to /api/url/ endpoint which returns a job_id.

Users send GET requests to /api/job which returns html of url submitted in initial request to /api/url



### Rate Limiting

To prevent people from abusing the API, I implemented a 60 job per hour limit

 