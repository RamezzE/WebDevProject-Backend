let timeout = 150;

function HideOverlay() {
  setTimeout(() => {
    let overlays = document.getElementsByClassName('overlay-div');
    for (let i = 0; i < overlays.length; i++)
      overlays[i].style.display = 'none';
  }, timeout);
}

function ShowForm(id) {
  setTimeout(() => {
    document.getElementById(id).style.display = 'flex';
    document.getElementById(id).style.flexDirection = 'column';
  }, timeout);
}

function submitForm(field) {
  let form = field.parentNode;
  let input = form.querySelector('div input');
  if (input.value == '')
      return;
  
  form.submit();
}

document.addEventListener('click', function handleClickOutsideBox(event) {
  const box = document.getElementsByClassName('overlay-div');
  //for each loop 
  for (let i = 0; i < box.length; i++)
    if (!box[i].contains(event.target)) {
      box[i].style.display = 'none';
    }
});
