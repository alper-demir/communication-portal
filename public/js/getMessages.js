window.addEventListener("load", async () => {
    const response = await axios.get(`/api/messages/${roomId}`)
    console.log(response.data)
    const messages = response.data.messages
    let content = ''
    messages.forEach(message => {
        if (message.receiverId == document.getElementById("userId").value) {
            content += `
            <div class="flex px-4">
            <img src="../../public/images/${message.friend.image}" class="w-8 h-8 rounded-full object-cover mr-1 ring-1 ring-orange-500">
            <p class="bg-green-100 dark:bg-[#444654] dark:text-white py-1 px-3 inline-block rounded-lg mb-4 max-w-[20rem]">${message.message}</p>
            </div>
            `
        }
        else {
            content += `
            <div class="flex justify-end px-4">
                <p class="bg-green-100 dark:bg-[#444654] dark:text-white py-1 px-3 inline-block rounded-lg mb-4 max-w-[20rem]">${message.message}</p>
            </div>
            `
        }
    });
    messageList.innerHTML = content
    sc.scrollTo(0, sc.scrollHeight)
})