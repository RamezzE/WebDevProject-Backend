
function TogglePhoto(field) {
    let imgs = field.getElementsByTagName('img');
    if (imgs[0].style.display == 'none') {

        imgs[0].style.display = 'block';
        imgs[1].style.display = 'none';
        return
    }

    imgs[0].style.display = 'none';
    imgs[1].style.display = 'block';
    
}