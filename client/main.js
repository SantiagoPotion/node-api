const loadInitialTemplate = () => {
    const template = `
        <h1>Tracks</h1>
        <form id="track-form">
            <div>
                <label>Name</label>
                <input name="name" />
            </div>
            <div>
                <label>Album</label>
                <input name="album" />
            </div>
            <button type="submit">Send</button>
        </form>
        <ul id="track-list"></ul>
    `

    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}

const getTracks = async () => {
    try {
        const jwt = localStorage.getItem('jwt')
        const response = await fetch('http://localhost:8000/tracks', {
            method: 'GET',
            headers: {
                Authorization: jwt
            }
        });

        const tracks = await response.json(); 
        if (Array.isArray(tracks)) {
            const template = track => 
            `<li>
                ${track.name} ${track.album} <button data-id="${track._id}">Delete</button>
            </li>`
            const trackList = document.getElementById('track-list');
            trackList.innerHTML = tracks.map(track => template(track)).join('');           
            tracks.forEach(track => {// Assigning the delete function to each button
                trackNode = document.querySelector(`[data-id="${track._id}"]`);
                trackNode.onclick = async e => {
                    await fetch(`http://localhost:8000/tracks/${track._id}`, {
                        method: 'DELETE',
                        headers: { Authorization: localStorage.getItem('jwt') }
                    })
                    trackNode.parentNode.remove();
                    alert('Deleted');
                }
            })
        } else {
            console.log('Is not array')
        }   
    } catch (e) {
        console.log(e);
    }
}


// LOGIN - LOGIN - LOGIN - LOGIN - LOGIN
const checkLogin = () => {
    return localStorage.getItem('jwt')
}
const loadLoginTemplate = () => {
    const template = `
    <h1>Login</h1>
    <form id="login-form">
    <div>
    <label>Email</label>
    <input name="email" />
    </div>
    <div>
    <label>Password</label>
    <input type="password" name="password" />
    </div>
    <button type="submit">Log in</button>
    </form>
    <a href="#" id="register">Sign up<a>
    <div id="error"></div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}
const addFormListener = () => {  // Track form to add tracks
    const trackForm = document.getElementById('track-form');
    
    trackForm.onsubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(trackForm);
        const data = Object.fromEntries(formData.entries());
        
        await fetch('/tracks', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('jwt')
            },
            // mode: "no-cors"
        })
        trackForm.reset();        
        getTracks();
    }
}
const addLoginListener = () => {
    const loginForm = document.getElementById('login-form')
    loginForm.onsubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(loginForm)            // Retrieving data from the form
        const data = Object.fromEntries(formData.entries()) // Converting to object

        const jwt = localStorage.getItem('jwt');
        const response = await fetch('http://localhost:8000/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwt
            },
            body: JSON.stringify(data), // We cannot send JavaScript Objects, we need to convert it to JSON     
            
        })

        const responseData = await response.json() // We don't need to convert this to a JSON, jwt and the error will be a string

        if (response.status >= 300) {
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } else {
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            tracksPage()
        }
    }
}
const goToRegisterListener = () => { // When we click the 'Sign up' link
    const goToRegister = document.getElementById('register')
    goToRegister.onclick = (event) => {
        event.preventDefault()
        registerPage()
    }
}


const tracksPage = () => {
    loadInitialTemplate();
    addFormListener();
    getTracks(); // getTracks
}
const registerPage = () => {
    console.log('register page')
    loadRegisterTemplate();
    addRegisterListener();
    goToLoginListener();
}
const loginPage = () => {
    loadLoginTemplate()
    addLoginListener()
    goToRegisterListener()
}


const loadRegisterTemplate = () => {
    const template = `
        <h1>Register</h1>
        <form id="register-form">
            <div>
                <label>Email</label>
                <input name="email" />
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" />
            </div>
            <button type="submit">Sign up</button>
        </form>
        <a href="#" id="login">Log in<a>
        <div id="error"></div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}
const addRegisterListener = () => {
    const registerForm = document.getElementById('register-form')
    registerForm.onsubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(registerForm)            // Retrieving data from the form
        const data = Object.fromEntries(formData.entries()) // Converting to object

        const response = await fetch('http://localhost:8000/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // We cannot send JavaScript Objects, we need to convert it to JSON     
            
        })
        
        const responseData = await response.json() // We don't need to convert this to a JSON, jwt and the error will be a string
        console.error(responseData);

        if (response.status >= 300) {
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } else {
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            tracksPage()
            //console.log(responseData)
        }
    }
}
const goToLoginListener = () => {
    const goToLogin = document.getElementById('login')
    goToLogin.onclick = (event) => {
        event.preventDefault()
        loginPage()
    }
}


window.onload = () => {
    const isLoggedIn = checkLogin()
    if (isLoggedIn) {
        tracksPage()
    } else {
        loginPage()
    }  
}

