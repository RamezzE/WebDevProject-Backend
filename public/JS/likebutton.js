function change(x,product_id) {
  x.style.display="none";
  x.nextElementSibling.style.display="inline";
  let form = document.createElement('form');
  form.method = 'POST';
  form.action = '/wishlist/add';
  let input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'product_id';
  input.value = product_id;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

function change2(x,product_id) {
  x.style.display="none";
  x.previousElementSibling.style.display="inline";
  let form = document.createElement('form');
  form.method = 'POST';
  form.action = '/wishlist/delete';
  let input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'product_id';
  input.value = product_id;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();  
}