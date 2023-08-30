Setting up Google Cloud account and obtaining the credentials:
  - create a Google cloud account and create your project
  - Go to https://console.cloud.google.com/apis/credentials
  - create an API key enabling Geocoding API, Google Sheets API, Maps JavaScript API
  - create a OAuth 2.0 client IDs with authorized javascript origin http://localhost
  - create a service account to have an online google sheets form created for that account
  - Download the service account keys, name it under 'serviceAcc_keys' file


Replacing the keys in index.html and server.js:

- Create a google sheet for the same account, where the Google cloud account has been created.
- Add the service account email ID as editor to that google sheet and obtain the spread sheet ID
- Replace "<YOUR_API_KEY>" with the Maps API key and "<YOUR_SPREADSHEET_ID>" with the spreadsheet ID we get
- Replace "<YOUR_FOLDER_PATH>" to the actual path of the folder that contains the files index.html, server.js and serviceAcc_keys.json, "<PORT_NUMBER>" to port number that you want the service to run


Running seerver.js:

- Install all the required dependecies using 'npm install'
- run the file 'node server.js'
- This opens up in your local host 
Here is a step by step set-up for you to run your application in google cloud

## 1. Google Cloud Platform (GCP) Setup:

### a. Create a Google Cloud Project:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project drop-down and then click on `New Project`.
3. Enter your project name and click `Create`.

### b. Enable Billing:

1. Go to the left sidebar, and navigate to `Billing`.
2. Follow the prompts to set up a billing account if you haven't already.

### c. Set up App Engine:

1. In the left sidebar, navigate to `App Engine`.
2. Click `Create Application`, select a region, and choose the language/environment you want (in your case, Node.js).

## 2. Deployment:

### a. Prepare App for Deployment:

Make sure you have a `package.json` in your project root, and it includes a `start` script that will start your server (e.g., `"start": "node server.js"`).

### b. Deploy:

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. Authenticate with your Google Cloud account by running: `gcloud auth login`.
3. Set your Google Cloud project: `gcloud config set project YOUR_PROJECT_ID`.
4. Navigate to your project directory and deploy your app with: `gcloud app deploy`.

Your application will be deployed to a URL like `https://YOUR_PROJECT_ID.REGION_ID.r.appspot.com`.

## 3. Set up Custom Domain:

### a. Buy a Domain:

If you don't have a domain, purchase one from registrars like Google Domains, Namecheap, GoDaddy, etc.

### b. Verify your Domain with Google:

1. In Google Cloud Console, navigate to `App Engine` > `Settings` > `Custom Domains`.
2. Click `Add a custom domain`.
3. Follow the prompts to verify ownership of your domain.

### c. Update Domain DNS records:

1. Once you've verified your domain, GCP will provide you with a set of DNS records.
2. Go to your domain registrar's website and update your domain's DNS records with the ones provided by GCP.

After some time (it can take a few hours to propagate), your custom domain will point to your Google Cloud-hosted application!

## Note:

- Make sure to understand the billing implications. Google Cloud offers a [free tier](https://cloud.google.com/free), but beyond that, charges will apply.
- Ensure you secure your application, especially if you're using sensitive data and APIs.
- Consider setting up HTTPS for your custom domain to ensure the data is encrypted during transit. Google App Engine provides a free managed SSL certificate for custom domains.




