const userid = document.getElementById("userid")
const requests = document.getElementById("requests")
window.addEventListener("load", async () => {
    const res = await axios.post("/api/request-status", {
        requestedId: userid.value
    })

    let requests = res.data.requesters

    let reqlength = requests.length
    const requestcounter = document.getElementById("request-count")
    requestcounter.innerText = `(${reqlength})`
    requests.forEach(request => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/user/${request.requesterId}`;
        a.textContent = `@${request.user.userName}`;
        li.appendChild(a);
        const acceptBtn = document.createElement('button');
        acceptBtn.innerHTML = '<i class="fa-solid fa-check" style="margin: 0 0.75rem"></i>';
        acceptBtn.addEventListener('click', async () => {
            li.remove();
            reqlength = reqlength - 1
            axios.post('/api/accept-request', { userId: userid.value, friendId: request.requesterId, requestId: request.id })
            requestcounter.innerText = `(${reqlength})`
        });
        li.appendChild(acceptBtn);
        const rejectBtn = document.createElement('button');
        rejectBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
        rejectBtn.addEventListener('click', async () => {
            li.remove();
            reqlength = reqlength - 1
            axios.post('/api/reject-request', { requestId: request.id })
            requestcounter.innerText = `(${reqlength})`
        });
        li.appendChild(rejectBtn);

        document.querySelector('#requests ul').appendChild(li);
    });

})

const showReq = () => {
    const req = document.getElementById("requests")
    if (req.classList.contains("hidden")) {
        req.classList.remove("hidden")
        req.classList.add("block")
    }
    else {
        req.classList.add("hidden")
        req.classList.remove("block")
    }
}

const showNotifications = () => {
    const notificationArea = document.getElementById("notificationArea")
    if (notificationArea.classList.contains("hidden")) {
        notificationArea.classList.remove("hidden")
        notificationArea.classList.add("block")
    }
    else {
        notificationArea.classList.add("hidden")
        notificationArea.classList.remove("block")
    }
}