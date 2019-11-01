import { escapeSpecialChars as escape } from '../javascripts/lib/helpers.js'

export default function (args, getTrackingStatus) {
  return `<div class="parcellab-app">
    <div>
      <h1>Hi ${escape(args.currentUserName)}, what order status would you like to check?</h1>
      <input id="getTrackingStatus" type="button" value="Check"">
    </div>
  </div>`
}
