const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const h337 = require('heatmap.js');
const logger = require('@mirasaki/logger');

const heatmapWidth = 500;
const heatmapHeight = 900;
const backgroundImage = './assets/images/body.png';
const backgroundImageDataUrl = `data:image/jpeg;base64,${ readFileSync(backgroundImage).toString('base64') }`;

const { PATH_TO_CHROME_EXECUTABLE } = process.env;

// Define the coordinates for each hit zone
const zoneCoordinates = {
  brain: {
    x: 240, y: 15
  },
  head: {
    x: 240, y: 45
  },

  torso: {
    x: 240, y: 225
  },

  rightLeg: {
    x: 295, y: 625
  },
  rightFoot: {
    x: 280, y: 840
  },
  rightHand: {
    x: 388, y: 440
  },
  rightArm: {
    x: 345, y: 311
  },

  leftLeg: {
    x: 190, y: 625
  },
  leftFoot: {
    x: 195, y: 850
  },
  leftHand: {
    x: 95, y: 450
  },
  leftArm: {
    x: 135, y: 300
  }
};

// Headless Puppeteer Chromium browser
// Use reference for increased speed, avoiding start up/#launch
let browser;
const initBrowser = async () => {
  const cfg = {
    headless: 'new',
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
  };
  if (PATH_TO_CHROME_EXECUTABLE) cfg.executablePath = PATH_TO_CHROME_EXECUTABLE;
  try {
    browser = await puppeteer.launch(cfg);
  }
  catch (err) {
    logger.syserr('Error encountered while launching headless puppeteer Chromium browser:');
    logger.printErr(err);
  }
  return browser;
};

/**
 * @returns {Promise<puppeteer.Browser>}
 */
const getBrowser = async (cfg) => {
  if (cfg.STATISTICS_KEEP_PUPPETEER_BROWSER_OPEN) {
    if (!browser) return await initBrowser();
    else return browser;
  }
  else return await initBrowser();
};

const createHitZonesHeatMap = async (cfg, hitZones = {
  brain: 15,
  head: 35,

  torso: 50,

  rightLeg: 40,
  rightFoot: 15,
  rightHand: 25,
  rightArm: 20,

  leftLeg: 40,
  leftFoot: 15,
  leftHand: 25,
  leftArm: 20
}) => {
  // Resolve our browser
  const browser = await getBrowser(cfg);

  // Open a new page
  const page = await browser.newPage();

  // Set the viewport size to match the heatmap dimensions
  await page.setViewport({
    width: heatmapWidth,
    height: heatmapHeight
  });

  // Include the heatmap.js library from a CDN
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/heatmap.js';
    document.head.appendChild(script);
  });

  // Wait for the heatmap.js library to load
  await page.waitForFunction(() => typeof h337 !== 'undefined');

  // Forward console logs
  if (process.env.NODE_ENV !== 'production') page.on('console', (msg) => console.info('PAGE LOG:', msg.text()));

  // Create a heatmap instance in the page context
  await page.evaluate(
    (
      hitZones,
      heatmapWidth,
      heatmapHeight,
      backgroundImage,
      zoneCoordinates
    ) => {
      // Create a canvas element for the heatmap
      const canvas = document.createElement('canvas');
      canvas.width = heatmapWidth;
      canvas.height = heatmapHeight;
      document.body.appendChild(canvas);
      canvas.style.zIndex = 9999;

      // Create a heatmap instance
      const heatmapInstance = h337.create({
        container: canvas,
        radius: 100,
        // maxOpacity: 1,
        // minOpacity: .5,
        // blur: .75
        gradient: {
          0: 'yellow',
          1.0: '#FF0000'
        }
      });

      // Set the background image for the heatmap
      const backgroundImageStyle = `url(${ backgroundImage })`;
      document.body.style.backgroundImage = backgroundImageStyle;

      // Add the hit zones data to the heatmap
      for (const zone in hitZones) {
        const value = hitZones[zone];
        if (!zoneCoordinates[zone]) continue;
        const { x, y } = zoneCoordinates[zone];
        heatmapInstance.addData({
          x, y, value: value
        });
      }

      canvas.style.backgroundImage = `url(${ heatmapInstance.getDataURL() })`;
    },
    hitZones,
    heatmapWidth,
    heatmapHeight,
    backgroundImageDataUrl,
    zoneCoordinates
  );

  // Capture a screenshot of the heatmap
  const img = await page.screenshot({ omitBackground: true });

  // Close the browser instance
  if (!cfg.STATISTICS_KEEP_PUPPETEER_BROWSER_OPEN) await browser.close();
  else await page.close();

  // Finally, return the image
  return img;
};

module.exports = { createHitZonesHeatMap };
