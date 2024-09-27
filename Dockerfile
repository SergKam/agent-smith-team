FROM node:18.1

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true


# Create Puppeteer config directory with proper permissions
RUN mkdir -p -m 777 /root/.config/puppeteer && chmod 777 /root/.config && chmod 777 /root

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.

RUN apt-get update  \
    && apt-get install curl gnupg -y \
    && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -\
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    &&  apt-get install google-chrome-stable -y --no-install-recommends \
    &&  apt-get clean \
    &&  rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /app
