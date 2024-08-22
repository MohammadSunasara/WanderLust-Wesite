const filterElements = document.querySelectorAll('#filter .filter');

filterElements.forEach((element) => {
    element.addEventListener('click', () => {
        // Get the filter value from the clicked element
        const filterValue = element.getAttribute('data-filter');

        // Construct the new URL for the filter
        const filterURL = `/listings/filter/${encodeURIComponent(filterValue)}`;

        // Redirect to the new URL
        window.location.href = filterURL;
    });
});
