fetch('https://your-backend-url.com/inject', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
    },
    body: JSON.stringify({ code: injectedCode })
})
.then(response => response.json())
.then(data => {
    // Handle the successful injection
})
.catch(error => {
    console.error("Error:", error);
});
