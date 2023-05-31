var btns = document.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

function addToWishlist(product_id) {
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
function addTocart(product_id) {
  let form = document.createElement('form');
  form.method = 'POST';
  form.action = '/cart/add';
  let input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'product_id';
  input.value = product_id;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}
