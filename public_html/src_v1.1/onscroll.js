function onscroll() {
    const nav = document.getElementsByTagName('nav')[0];
    const side = document.getElementsByClassName('sideMenu')[0];
    if (!side.classList.contains('slide')) {
        if (window.scrollY >= 100) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    }
}