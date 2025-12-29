export function ThemeScript() {
  const codeToRun = `(function() {
    try {
      const theme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
    } catch (e) {}
  })();`;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: codeToRun,
      }}
    />
  );
}

