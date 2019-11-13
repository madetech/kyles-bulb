# Kyles-Bulb :crystal_ball:

Kyle's house needs lighting or he might die.

## Installation

1. Run `npm install`
2. Add .env file (see .env.sample for file structure)
3. Install the Tuya app on your phone and get it talking to your bulb

## Get The Device Properties

To connect to your bulb you need a few bits of data from it. In order to do this you need to sniff some data using a web debugging proxy app. I used [Charles](https://www.charlesproxy.com/download/).

### Computer Setup

1. Install Charles.
2. Under SSL Proxying Settings add `*.*` as a location.

### Phone Setup

1. In your wifi connection settings, set the proxy to Manual with your computers local IP address as the host and 8888 as the port.
2. Open a browser on your phone and Charles will display a dialog - click Allow.
3. Download and install the Charles SSL certificate [here](http://charlesproxy.com/getssl). Make sure you remove this and the proxy when you are done.

### Sniff It Good

Now you should be ready to sniff for the interesting tings. Start recording in Charles and then open your Tuya app and access your bulb. Wait for a bit, you should see some data come in from a Tuya URL.

Do a find in Charles for 'uuid' and 'localKey'. These are your deviceId and deviceKey respectively. They should appear in the same request.

### Get The Bulb IP

Lastly you need the bulbs local IP address. I found the easiest way to do this was to get the bulbs MAC address from the app and then run `arp -a` in the terminal. You should find a match there if the bulb has power and has been connected to the network.

## Update Your Env

Update your .env file with your DEVICE_ID, DEVICE_KEY, and DEVICE_IP

## Run

`node index.js`

## Endpoints

- `/` returns the bulb state.
- `/toggle` turns the bulb on/off
- `/colour` changes the colour-mode to colour
- `/white` changes the colour-mode to white
- `/white/:level` sets the white brightness level

## Acknowledgments

This code uses the [TuyAPI](https://github.com/codetheweb/tuyapi) library to do all the tricky stuff. The docs [here](https://codetheweb.github.io/tuyapi/index.html) are very helpful.

## Troubleshooting

If your bulb stops responding to set commands, it unfortunately means the key has changed and you need to get the new one. You can prevent this by not disconnecting the bulb.
