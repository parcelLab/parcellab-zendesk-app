# parcellab-zendesk-app

A Zendesk ticket sidebar app to check order status via parcelLab API.
Project structure is based on [zendesk/app_scaffold](https://github.com/zendesk/app_scaffold)

## Support

If you have any specifc questions, please feel free to contact Andre (hmmmsausages / andre@parcellab.com)

## Prerequisite

To successfully test the integration of this Zendesk with a live Zendesk portal and package the Zendesk app for a production release, you will need the Zendesk app tools (`zat`), which is a CLI Ruby app.

If you're on macOS you should already have Ruby installed by default, so all you need to do in that case is:

```bash
# Install rake, which is required by the Zendesk app tools
gem install rake
# Install the Zendesk app tools
gem install zendesk_app_tools
```

It's also worthwhile to check out the following resources, so you get an idea how the development lifecycle of a Zendesk app works:

- [https://develop.zendesk.com/hc/en-us/categories/360000003408-Zendesk-apps](https://develop.zendesk.com/hc/en-us/categories/360000003408-Zendesk-apps)

## How To Run This App Locally

1. `npm install`
1. `npm run watch` - compiles and watches files with webpack
1. Open a new command line window in the root app directory
1. Edit `./settings.yml` to change the Zendesk app's test configuration settings. By default it is using the 'parcelFashion' userId and the ticket field ID for the 'order number' ticket field of the 'd3v-parcellab' Zendesk support board.
1. `zat server -p dist` - Serves the app to your Zendesk instance with `?zat=true`
1. Open up a browser, navigate to a ticket in Zendesk, ensure you have the above query parameter set in your browser's address bar. You should then see your app being served and any local changes will be automatically deployed. In most browsers you will need to explicitly allow loading unsafe scripts or mixed content (warning on the right side of the address bar), due to the way the integration with your local Zendesk app works.

## How To Run The Tests

1. `npm install`
1. `npm test`

## Compile The App For Production

1. `npm install`
1. `npm run build`
1. `zat validate -p dist` - Validates the app against Zendesk's quality profile. If no errors or warnings are shown, the app should be runnable.
1. `zat package -p dist` - This will package the app into a zip file and place it in `./dist/tmp/*`. The zip file can then be used to release the app in the Zendesk marketplace.

## General App Structure

*Note:* Zendesk enforces the mandatory existence of some files and their folder structure. This is mainly for I18N and Zendesk marketplace documentation purposes: Please see [developer.zendesk.com/apps/docs/developer-guide/setup#file-requirements](https://developer.zendesk.com/apps/docs/developer-guide/setup#file-requirements) for more information

- src: contains all Zendesk app Javascript & React source code
  - image: contains all images. *Note:* that some images are mandatory and required by Zendesk even though they're are not actively used in the source code
  - javascripts
    - lib: contains all non React helper functions
    - modules: contains all React components
  - templates: contains the iframe HTML base structure for the Zendesk app
  - translations: contains all language files for I18N. *Note:* `en.json` is mandatory
- spec: contains all Jest tests (unit/integration)
- webpack: contains webpack helper functions
