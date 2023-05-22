function submitForm(field) {
    let form = field.parentNode;
    let input = form.querySelector('div input');
    if (input.value == '')
        return;
    
    form.submit();
}

function copyToClipboard(button, className) {
    console.log(className);
    let parent = button.parentNode.parentNode; // Use parentNode instead of parent
    let copyText = parent.querySelector('.' + className); // Use querySelector instead of getElementsByClassName and specify class with a dot prefix
    
    // Create a temporary textarea element
    let tempTextarea = document.createElement('textarea');
    tempTextarea.value = copyText.textContent.trim();
    document.body.appendChild(tempTextarea);
  
    // Select the value inside the textarea
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999);
    
    // Execute the copy command
    document.execCommand('copy');
    
    // Remove the temporary textarea
    document.body.removeChild(tempTextarea);
  }
  