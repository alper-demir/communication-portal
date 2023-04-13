const htmlTag = document.querySelector("html")
const colorIcon = document.getElementById("coloricon");

window.addEventListener('load', () => {
    const theme = localStorage.getItem("theme")
    console.log(theme)
    if (theme == "dark") {
        colorIcon.classList.add("fa-sharp")
        colorIcon.classList.add("fa-solid")
        colorIcon.classList.remove("fa-regular")
        htmlTag.classList.add("dark")
    }
    else {
        colorIcon.classList.remove("fa-sharp")
        colorIcon.classList.remove("fa-solid")
        colorIcon.classList.add("fa-regular")
        htmlTag.classList.remove("dark")
    }
})

const changeColorMode = () => {
    if (colorIcon.classList.contains("fa-sharp")) {
        colorIcon.classList.remove("fa-sharp")
        colorIcon.classList.remove("fa-solid")
        colorIcon.classList.add("fa-regular")
        htmlTag.classList.remove("dark")
        localStorage.setItem("theme", "light")
    }
    else {
        colorIcon.classList.add("fa-sharp")
        colorIcon.classList.add("fa-solid")
        colorIcon.classList.remove("fa-regular")
        htmlTag.classList.add("dark")
        localStorage.setItem("theme", "dark")
    }
}
const showFriendList = () => {
    const list = document.getElementById("friendsList");
    if (list.classList.contains("hidden")) {
        list.classList.remove("hidden")
    } else {
        list.classList.add("hidden")
    }
}
