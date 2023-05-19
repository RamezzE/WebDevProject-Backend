let timeout = 150;

function ShowProductForm() {
    setTimeout(() => {
        document.getElementById('product-overlay').style.display = 'flex';
		document.getElementById('product-overlay').style.flexDirection = 'column';
    }, timeout);
}

function HideProductForm() {
	document.getElementById('product-overlay').style.display = 'none';
}

document.addEventListener('click', function handleClickOutsideBox(event) {
    const box = document.getElementById('product-overlay');
  
    if (!box.contains(event.target)) {
      box.style.display = 'none';
    }
});