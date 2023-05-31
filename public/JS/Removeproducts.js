function RemoveWishlist(product_id) {
  let form = document.createElement("form");
  form.method = "POST";
  form.action = "/wishlist/delete";
  let input = document.createElement("input");
  input.type = "hidden";
  input.name = "product_id";
  input.value = product_id;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}
function RemoveCart(product_id) {
  let form = document.createElement("form");
  form.method = "POST";
  form.action = "/cart/delete";
  let input = document.createElement("input");
  input.type = "hidden";
  input.name = "product_id";
  input.value = product_id;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}
