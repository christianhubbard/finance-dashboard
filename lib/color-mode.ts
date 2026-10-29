export const COLOR_MODE_STORAGE_KEY = "finance-theme";

// Runs in <head> before first paint so the saved/OS preference applies without a flash.
export const colorModeInitScript = `(function(){try{var t=localStorage.getItem("${COLOR_MODE_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;
