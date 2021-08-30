const toggleDarkMode = () => {
  const styles = document.getElementById("theme");
  let theme = localStorage.theme;

  if (theme == "dark") {
    styles.href = "styles/light.css";
    theme = "light";
  } else {
    styles.href = "styles/dark.css";
    theme = "dark";
  }

  localStorage.theme = theme;

  return false;
};

const initTheme = () => {
  const styles = document.getElementById("theme");
  let theme = localStorage.theme;

  if (theme == null) {
    theme = "dark";
  }

  if (theme == "light") {
    styles.href = "styles/light.css";
  }
  localStorage.theme = theme;
};
initTheme();
