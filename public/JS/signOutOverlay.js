document.addEventListener('click', function handleClickOutsideBox(event) {
    const box = document.getElementById('sign-out');
  
    if (!box.contains(event.target)) {
      box.style.display = 'none';
    }
  });