
let sidebar = document.querySelector("#sidebar");
let sidebarText = sidebar.getElementsByTagName("span");

function toggleSidebar() {
    console.log(window.innerWidth);
    let collapsed, full;
    if (window.innerWidth <= "600") {
        collapsed = "60px";
        full = "220px";
    }
    else {
        collapsed = "90px";
        full = "250px";
    }
    if (sidebar.style.width == collapsed) {
        sidebar.style.width = full;
        for (let i = 0;i<sidebarText.length;i++) {
            sidebarText[i].style.visibility = "visible";
        }
    }
    else  {
        sidebar.style.width = collapsed;
        for (let i = 0;i<sidebarText.length;i++) {
            sidebarText[i].style.visibility = "collapse";
        }
        // sidebarText.style.width = "0px";
    }
}

function closeSidebar() {
    for (let i = 0;i<sidebarText.length;i++) {
        sidebarText[i].style.visibility = "collapse";
    }

    if (window.innerWidth <= "600") {
        sidebar.style.width = "60px";
    }
    else {
        sidebar.style.width = "90px";
    }
}

window.onresize = function () {
    closeSidebar();
}

// let topNav = document.getElementById("topNav");
// let sticky = topNav.offsetTop;

// window.onscroll = function () { makeSticky()};

// function makeSticky() {
//     if (window.pageYOffset >= sticky) {
//         topNav.classList.add("sticky");

//     } else {
//         topNav.classList.remove("sticky");
//     }
// }

let corresponding_items = document.getElementsByClassName('only-one');

function OneAtATime(one_to_show) {
    for (i = 0; i < corresponding_items.length; i++) {
        corresponding_items[i].style.display = 'none';
        document.getElementById(one_to_show).style.display = 'block';
    }
}

let items = sidebar.getElementsByTagName("a");
function makeActive(item) {
    for (let i = 0;i<items.length;i++) {
        items[i].classList.remove("active");
    }
    item.classList.add("active");
}

function toggleRemoveUser() {
    
}


