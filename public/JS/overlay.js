let timeout = 150;

function ShowOverlay(overlay) {
    setTimeout(() => {
        document.getElementsByClassName(overlay).style.display = 'block';
    }, timeout);
}

function HideOverlay(overlay) {
    setTimeout(() => {
        document.getElementById(overlay).style.display = 'none';
    }, timeout);
}

document.addEventListener('click', function handleClickOutsideBox(event) {
    const box = document.getElementById('product-overlay');
  
    if (!box.contains(event.target)) {
      box.style.display = 'none';
    }
  });

document.addEventListener('click', function handleClickOutsideBox(event) {
    const box = document.getElementById('sign-out');
  
    if (!box.contains(event.target)) {
      box.style.display = 'none';
    }
  });