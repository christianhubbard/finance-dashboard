/** Inline script to apply saved theme before paint (avoids flash). */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem("finance-color-theme");if(t==="dark")document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark")}catch(e){}})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
