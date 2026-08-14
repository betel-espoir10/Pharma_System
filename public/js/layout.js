document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  if (!toggleButton || !sidebar) return;

  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    if (content) content.classList.toggle("expanded");
  });
});
