const user = document.getElementById("userid").value
window.addEventListener("load", () => {
    notificationReq()
})

const notificationReq = async () => {
    const response = await axios.post(`/api/messages-notify/${user}`)
    console.log(response)
}