// ==UserScript==
// @name         SubspleaseExtractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a checkbox with "Add" option for a specified class to the left of the title when Ctrl + Shift + Y is pressed
// @author       BlueMountainBlackTea
// @match        https://subsplease.org/shows/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Define the class you want to add checkboxes for
    const targetClass = "all-shows-link";

    // Function to add checkbox with "Add" option
    function addCheckbox() {
        // Get all elements with the target class
        const elements = document.getElementsByClassName(targetClass);
        // Loop through each element and add the checkbox
        Array.from(elements).forEach(element => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = element.textContent.trim(); // Set checkbox value to element text
            checkbox.id = `${targetClass}-checkbox-add`; // Unique ID for the checkbox
            const label = document.createElement("label");
            label.setAttribute("for", checkbox.id);
            label.textContent = "Add";
            // Add color styling to the checkbox
            checkbox.style.backgroundColor = "lightblue";
            checkbox.style.marginRight = "5px"; // Add space between checkbox and title
            // Insert checkbox before the title element
            element.insertBefore(checkbox, element.firstChild);
        });
    }

    // Function to extract checked checkboxes
    function extractCheckedCheckboxes() {
        const checkboxes = document.querySelectorAll(`.${targetClass} input[type="checkbox"]:checked`);
        const names = Array.from(checkboxes).map(checkbox => checkbox.value);
        return names.join('\n');
    }

    // Function to add "Extract" button
    function addExtractButton() {
        const extractButton = document.createElement("button");
        extractButton.textContent = "Extract";
        extractButton.style.position = "fixed";
        extractButton.style.bottom = "10px";
        extractButton.style.left = "10px";
        extractButton.style.zIndex = "9999"; // Ensure button is above other elements
        extractButton.style.display = "none"; // Hide the button initially
        extractButton.addEventListener("click", function() {
            // Extract checked checkboxes and create a downloadable file
            const extractedData = extractCheckedCheckboxes();
            if (extractedData) {
                const blob = new Blob([extractedData], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'checkbox_data.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert("No checkboxes are checked.");
            }
        });
        document.body.appendChild(extractButton);
        return extractButton;
    }

    const extractButton = addExtractButton();

    // Listen for keydown events
    document.addEventListener('keydown', function(event) {
        // Check if Ctrl + Shift + Y are pressed simultaneously
        if (event.ctrlKey && event.shiftKey && event.key === 'Y') {
            // Add the checkbox when the key combination is detected
            addCheckbox();
            // Show the "Extract" button
            extractButton.style.display = "block";
        }
    });

    // Add CSS styling
    GM_addStyle(`
        input[type="checkbox"] {
            /* Add custom styles here */
        }
    `);
})();
