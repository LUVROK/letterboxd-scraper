# Letterboxd Node Scraper

## Introduction
The "Letterboxd Node Scraper" is a project designed to parse and retrieve all the movies watched by a user on the Letterboxd website. To ensure smooth operation, it's essential to configure the environment correctly, starting with the creation of an `.env` file in the project's root directory.

## Creating the .env File
In the root of the Letterboxd Node Scraper project, create a `.env` file to store important environment variables.

## Configuring the .env File
Add the following entry to the `.env` file to connect to Rendertron. Please refer to the installation instructions for Rendertron provided at the end of this document:
- `URL_RENDERTRON=your_rendertron_ip:port`
- For example: `URL_RENDERTRON=192.168.1.1:3000`

## Steps to Add Rendertron URL to .env File
1. Navigate to the project's root directory.
2. Create a new file named `.env`.
3. Enter the Rendertron URL in the following format: `URL_RENDERTRON=your_rendertron_ip:port`.
4. Replace `your_rendertron_ip:port` with the actual IP address and port of your Rendertron setup.
5. Save the .env file.

_Note for Users:_
- The .env file is crucial for the scraper's functionality. Ensure the IP and port correspond to your Rendertron setup.
- Keep the .env file secure as it contains sensitive configuration details.

# Deploying Rendertron

## Prerequisites
- Ensure Node.js and npm are installed.
- Have administrator access to the server.

## Cloning Rendertron Repository
- Execute `git clone https://github.com/GoogleChrome/rendertron.git`.
- Navigate to the cloned directory with `cd rendertron`.

## Installing Dependencies
- Run `npm install` to install the necessary project dependencies.

## Configuring Rendertron
- Modify `config.json` in the project directory to set up the desired port.

## Starting Rendertron
- Launch Rendertron by running `npm start`.

## Resolving Browser Launch Error
- Install dependencies required for Chromium (used by Puppeteer) on most Linux systems:

sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget


## Configuring the Firewall
- Allow incoming requests on your chosen port (e.g., 3000):
- Add a rule with `sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT`.
- Allow outgoing responses with `sudo iptables -A OUTPUT -p tcp --sport 3000 -j ACCEPT`.

## Saving iptables Changes
- Install `iptables-persistent` to save and apply iptables rules on system boot:
- Use `sudo apt-get install iptables-persistent`.

_Note for Juniors:_
- The above steps are crucial for setting up Rendertron on your server.
- Ensure each command is executed correctly.
- Modify the port number in the iptables rules and `config.json` as per your requirements.
