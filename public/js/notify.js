const user = document.getElementById("userid").value
const notificationArea = document.getElementById("notificationArea");
const notificationCount = document.getElementById("notification-count");

window.addEventListener("load", () => {
    getNotifications()
})

setInterval(() => {
    getNotifications()
}, 5000);

const getNotifications = async () => {
    const response = await axios.post(`/api/messages-notify/${user}`)
    console.log(response)
    let notificationItem = ''
    if (response.data) {
        const notifications = response.data;
        notificationCount.innerText = `(${notifications.length})`
        notifications.forEach(notification => {
            notificationItem += `<li onclick="getNotifications()"><a href="/chat/${notification.friend.id}"</a> ${notification.friend.userName} <span class="bg-yellow-200">(${notification.count})</span></li>`;
        });
        notificationArea.innerHTML = `<ul>${notificationItem}</ul>`
    }

    response.data.forEach(res => {
        console.log(res.roomId + " odasından " + res.count + " adet okunmamış mesajınız var")
    })

}