const receiver = document.getElementById("recieverid")
const requester = document.getElementById("requesterid")
const requestButton = document.getElementById("btn-req")

window.addEventListener("load", async () => {
    const res = await axios.post('/api/friend-request-status', {
        receiverId: receiver.value,
        requesterId: requester.value
    });

    if (res.data.status == "pending") {
        requestButton.innerText = "pending"
    }
    console.log(res)
})

const sendFriendRequest = async () => {
    const res = await axios.post('/api/friend-request', {
        receiverId: receiver.value,
        requesterId: requester.value
    });
    requestButton.innerText = res.data.status
    console.log(res)
    console.log(res.data.status)
};