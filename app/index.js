import { COLORS } from "./config.js";

// set color variavles on css
Object.keys(COLORS).forEach(key => {
  document.body.style.setProperty(`--${key}`, COLORS[key]);
});

