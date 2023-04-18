const userid = document.getElementById("userid")
const requests = document.getElementById("requests")
window.addEventListener("load", async () => {
    const res = await axios.post("/api/request-status", {
        requestedId: userid.value
    })
    console.log(res)

    let temp = []

    temp = res.data.requesters
    console.log(temp)
    let index = 0
    const requestcounter = document.getElementById("request-count")
    requestcounter.innerText = `(${temp.length})`
    temp.forEach(request => {
        const li = document.createElement('li');
        li.setAttribute("index", index)
        const a = document.createElement('a');
        a.href = `/user/${request.requesterId}`;
        a.textContent = `@${request.user.userName}`;
        li.appendChild(a);
        const acceptBtn = document.createElement('button');
        acceptBtn.innerHTML = '<i class="fa-solid fa-check" style="margin: 0 0.75rem"></i>';
        acceptBtn.addEventListener('click', async () => {
            document.querySelector('#requests ul').children[index - 1].remove()
            axios.post('/api/accept-request', { userId: userid.value, friendId: request.requesterId, requestId: request.id })
            requestcounter.innerText = `(${temp.length - 1})`
        });
        li.appendChild(acceptBtn);
        const rejectBtn = document.createElement('button');
        rejectBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
        rejectBtn.addEventListener('click', async () => {
            document.querySelector('#requests ul').children[index - 1].remove()
            axios.post('/api/reject-request', { requestId: request.id })
            requestcounter.innerText = `(${temp.length - 1})`
        });
        li.appendChild(rejectBtn);

        document.querySelector('#requests ul').appendChild(li);
        index++
    });
})