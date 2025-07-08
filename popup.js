document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    const highlightsList = document.getElementById('highlights-list');

    // Load saved highlights from storage
    chrome.storage.local.get('highlights', function(data) {
        const highlights = data.highlights || [];
        highlights.forEach(function(highlight) {
            addHighlightToList(highlight);
        });
    });

    // Save button click event
    saveBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                files: ['content.js']
            }, function() {
                chrome.storage.local.get('selectedText', function(data) {
                    const selectedText = data.selectedText;
                    if (selectedText) {
                        chrome.storage.local.get('highlights', function(data) {
                            const highlights = data.highlights || [];
                            highlights.push(selectedText);
                            chrome.storage.local.set({highlights: highlights}, function() {
                                addHighlightToList(selectedText);
                            });
                        });
                    }
                });
            });
        });
    });

    // Clear button click event
    clearBtn.addEventListener('click', function() {
        chrome.storage.local.set({highlights: []}, function() {
            highlightsList.innerHTML = '';
        });
    });

    function addHighlightToList(text) {
        const li = document.createElement('li');
        li.textContent = text;
        highlightsList.appendChild(li);
    }
}); 