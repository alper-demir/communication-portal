const editComment = (id) => {
    const editArea = document.getElementById(`editArea${id}`)
    const editText = document.getElementById(`editText${id}`)
    const orgContent = document.getElementById(`orgContent${id}`).innerText

    if (editArea.classList.contains("hidden")) {
        editArea.classList.remove("hidden")
        editText.innerText = orgContent
    }
    else {
        editArea.classList.add("hidden")
    }
}

const saveEdit = async (commentId, index) => {

    const editText = document.getElementById(`editText${index}`)
    const newText = editText.value
    const req = await axios.post("/api/edit-comment", {
        editedText: newText,
        commentId: commentId
    })
    if (req.status === 200 && req.statusText === "OK") {
        const nofity = await swal(req.data.message, "", "success")
        if (nofity) {
            location.reload()
        }
    }
    else {
        swal(req.data.message, "", "error")
    }
    location.reload()
    console.log(req)
}
