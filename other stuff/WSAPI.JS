<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Injection Admin Panel</title>
    <style>
        /* Apply Comic Sans font to everything */
        body {
            font-family: 'Comic Sans MS', cursive, sans-serif;
        }
        .panel {
            margin: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
        }
        textarea {
            width: 100%;
            height: 200px;
            margin-bottom: 10px;
            font-family: 'Comic Sans MS', cursive, sans-serif; /* Comic Sans for textarea */
        }
        button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            font-family: 'Comic Sans MS', cursive, sans-serif; /* Comic Sans for button */
        }
    </style>
</head>
<body>

<div class="panel">
    <h2>Admin Panel: Inject Custom Code</h2>
    <textarea id="customCode" placeholder="Enter HTML/JS/CSS here..."></textarea>
    <button onclick="injectCode()">Inject Code</button>
</div>

<script>
    function injectCode() {
        const code = document.getElementById("customCode").value;

        // Normally, here you would use token-based authentication to secure the action
        // But for now, we are just focusing on the functionality

        // Send code to the server (this would be your API endpoint for saving code)
        fetch('/inject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_TOKEN_HERE' // Include token for security
            },
            body: JSON.stringify({ code: code })
        })
        .then(response => response.json())
        .then(data => {
            alert("Code injected successfully!");
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to inject code.");
        });
    }
</script>

</body>
</html>
