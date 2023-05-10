let products = document.getElementsByClassName('product');
for(let i = 0;i<products.length;i++) {
    products[i].addEventListener('click', function (event) {
        location.href = "/ProductDetails";
    });
} 