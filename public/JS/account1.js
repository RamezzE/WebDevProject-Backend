// let left_nav = document.getElementById('left-col');
// let nav_items = document.getElementsByClassName('nav-item');
let account_corresponding_items = document.getElementsByClassName('account-only-one');

function AccountOneAtATime(one_to_show) {
    for (i = 0; i < account_corresponding_items.length; i++) {
        account_corresponding_items[i].style.display = 'none';
        document.getElementById(one_to_show).style.display = 'flex';
    }
}