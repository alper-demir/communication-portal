const receiver = document.getElementById("recieverid").value
const requester = document.getElementById("requesterid").value
const requestButton = document.getElementById("btn-req")

window.addEventListener("load", async () => {
    const res = await axios.post('/api/friend-request-status', {
        receiverId: receiver,
        requesterId: requester
    });

    if (res.data.status == "pending") {
        requestButton.innerText = "pending"
    }
    res.data.status ? requestButton.innerText = res.data.status : ""
    console.log(res)
})

const sendFriendRequest = async () => {
    const res = await axios.post('/api/friend-request', {
        receiverId: receiver,
        requesterId: requester
    });
    requestButton.innerText = res.data.status
    console.log(res)
    console.log(res.data.status)
};

const unFriend = async () => {
    const userResponseUnfriend = window.confirm("Are you sure unfriend?")

    if (userResponseUnfriend) {
        const response = await axios.post("/api/friendship-delete", {
            userId: receiver,
            friendId: requester
        })

        console.log(response)

        if (response.status === 200) {
            window.location.href = `/user/${receiver}`
        }
    }
}

const acceptFriendRequest = async () => {
    await axios.post("/api/accept-request", {
        userId: receiver,
        friendId: requester
    })
    window.location.href = `/user/${receiver}`
}

const rejectFriendRequest = async () => {
    await axios.post("/api/reject-request", {
        userId: receiver,
        friendId: requester
    })
    window.location.href = `/user/${receiver}`
}