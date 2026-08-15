document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  if (toggleButton && sidebar) {
    toggleButton.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      if (content) content.classList.toggle("expanded");
    });
  }

  document.querySelectorAll("table.table").forEach((table) => {
    const parent = table.parentElement;
    if (parent && parent.classList.contains("table-responsive")) {
      parent.classList.add("table-scroll");
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "table-responsive table-scroll";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
});
