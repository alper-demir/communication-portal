function starttopic() {
    const topiccreate = document.getElementById("topiccreate")
    if (topiccreate.classList.contains("hidden")) {
        topiccreate.classList.add("block")
        topiccreate.classList.remove("hidden")
    }
    else {
        topiccreate.classList.remove("block")
        topiccreate.classList.add("hidden")
    }
}