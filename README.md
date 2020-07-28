
# GAE Node Micro-service Deployment
This document will walk you through how to deploy multiple Node.js servers in a single project using Google App Engine (GAE). This is considered to be a microservice architecture, where each individual server is an isolated service.
## 1. App Preperation
### PORT Number
Before deploying a Node JS project you must slightly edit the code. Wherever you define the server's port number within the code, you must give the option for the server to use `PORT` rather than being restricted to a single statically defined port number.
```
const express = require('express');

const app = express();

app.use('/', (req, res) => {
    res.json({ 'message': 'Hello from Node microservice1!' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Node server listening on port ${port}`);
});
```
source: hello.js
### package.json
package.json needs to be in the same directory so GAE knows the dependancies of the given app.
###  yaml file
Each service in a microservice architecture has its own yaml file. This yaml file defines the parameters for how a service will run on GAE.

In order for each service in the microservice architecture to run independently on GAE, you must define the `service` parameter with a unique name. In this example we define this service as `nodeservice1`.

```
runtime: nodejs
env: flex
service: nodeservice1

manual_scaling:
  instances: 1
resources:
  cpu: 1
  memory_gb: 0.5
  disk_size_gb: 10
```
source: node1-app.yaml
> Note: This yaml file isn't particularly performant. The settings above are to reduce costs during testing and not appropriate for production use. You would obviously want to increase the values for computing resources and look into auto scaling when running production workloads.

## 2. GCP Setup

 - Create Google Cloud Platform account using Gmail address.
 - Download [Google Cloud SDK](https://cloud.google.com/sdk/docs). Then within the Google Cloud SDK Shell, update with the following command: `gcloud components update`
## 3. Create Project
Create new project:
 `
gcloud projects create [YOUR_PROJECT_ID] --set-as-default
`

Replace `[YOUR_PROJECT_ID]` with a [string of characters](https://cloud.google.com/sdk/gcloud/reference/projects/create#PROJECT_ID) that uniquely identifies your project. For example, `my-project-24`.

Verify the project was created:
```
gcloud projects describe [YOUR_PROJECT_ID]
```
You see project details that might look like the following:

```
createTime: year-month-hour
lifecycleState: ACTIVE
name: project-name
parent:
id: '433637338589'
type: organization
projectId: project-name-id
projectNumber: 499227785679
```
## 4. Initialise App Engine
Initialize your App Engine app with your project and choose its region:
	```gcloud app create --project=[YOUR_PROJECT_ID]```
> europe-west2 is London

## 5. Enable Billing
Before you can get services running on you project, you must [enable billing](https://console.cloud.google.com/projectselector/billing?lang=nodejs&st=true&_ga=2.171166304.1984208956.1595852840-319678561.1595852840) for it.

## 6. Deploy Node App as Microservice
Assuming you have followed the steps in **1. App Preparation**. Using the Google Cloud SDK Shell cd into the sub-directory where the yaml file is located for the given app/ service you want ot deploy. Deploy app using the following command:
`gcloud app deploy node1-app.yaml`
> Replace node1-app.yaml with whatever the name of the yaml file is for the given service you want to deploy

This should take maybe ten minutes to complete.  

Once completed, you will be given a URL that looks something like https://nodeservice1-dot-micro-service-example-james.nw.r.appspot.com/

Repeat this process for each micro-service you want to deploy to the Project.

## References
https://cloud.google.com/appengine/docs/flexible/nodejs/quickstart

https://medium.com/google-cloud/node-python-and-go-microservices-in-a-single-google-app-engine-project-54aac3d60225

https://docs.microsoft.com/en-us/azure/devops/pipelines/process/runtime-parameters?view=azure-devops&tabs=script

https://cloud.google.com/appengine/docs/standard/go/config/appref
