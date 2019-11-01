# parcellab-zendesk-app


A Zendesk ticket sidebar app to check order status via parcelLab API.
Project structure is based on [zendesk/app_scaffold](https://github.com/zendesk/app_scaffold)



# How To Run This App Locally

1) `npm install`
1) `npm run watch` - compiles and watches files with webpack
1) Open a new command line window in the root app directory
1) `zat server -p dist` - Serves the app to your Zendesk instance with `?zat=true`
1) Open up a browser, navigate to a ticket in Zendesk, ensure you have the above query parameter set in your browser's address bar. You should then see your app being served and any local changes will be automatically deployed. In most browsers you will need to explicitly allow loading unsafe scripts or mixed content (warning on the right side of the address bar), due to the way the integration with your local Zendesk app works.

# How To Run The Tests

1) `npm install`
1) `npm test`


# Compile The App For Production
1) `npm install`
1) `npm run build`
1) `zat validate -p dist` - Validates the app against Zendesk's quality profile. If no errors or warnings are shown, the app should be runnable.
1) `zat package -p dist` - This will package the app into a zip file and place it in `./dist/tmp/*`. The zip file can then be used to release the app in the Zendesk marketplace.
