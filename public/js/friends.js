const userId = document.getElementById("userid")
const friendsList = document.getElementById("friendsList")
const onlineCountEl = document.getElementById('online-count');
const totalCountEl = document.getElementById('total-count');

window.addEventListener("load", () => {
    req()
})

setInterval(() => {
    req()
}, 5000)

const req = async () => {
    const response = await axios.post("/api/friend-status", { userId: userId.value })
    if (response.data) {
        const friends = response.data

        const onlineFriends = friends.filter(friend => friend.friend.online);
        const offlineFriends = friends.filter(friend => !friend.friend.online);

        onlineCountEl.textContent = onlineFriends.length.toString();
        totalCountEl.textContent = friends.length.toString();

        let listItems = ""

        onlineFriends.forEach((friend) => {
            const onlineClass = "bg-teal-500";
            listItems += `<li><div class="w-2 h-2 rounded-full ${onlineClass} inline-block"></div> ${friend.friend.userName}</li>`
        })

        offlineFriends.forEach((friend) => {
            const onlineClass = "bg-gray-600";
            listItems += `<li><div class="w-2 h-2 rounded-full ${onlineClass} inline-block"></div> ${friend.friend.userName}</li>`
        })

        friendsList.innerHTML = `<ul>${listItems}</ul>`
    }
}