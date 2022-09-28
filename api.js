class api {
    constructor() {
        if(localStorage.getItem("url") == null) {
            localStorage.setItem("url", "http://localhost:5000/")
        }
    }
    login = (username, password) => {
        fetch(`http://localhost:5000/login/${username}/${password}`).then(data => {
            data.text().then(response_text => {
                if (response_text.split(' - ')[0] == 200) {
                    localStorage.setItem('login_key', response_text.split(' - ')[1])
                    alert("Succesfully logged in");
                    console.log("[debug] Setting secure key to " + response_text.split(' - ')[1])
                } else {
                    alert("Username or Password is incorrect")
                }
            })
        })
    }

    register = (username, password) => {
        fetch(`${localStorage.getItem("url")}register/${username}/${password}`).then(data => {
            data.text().then(response_text => {
                if (response_text.split(' - ')[0] == 201) {
                    console.log("[debug] User made: " + username)
                    alert("User created: " + username)
                } else {
                    if(response_text.split(' - ')[0] == 401) {
                        alert("User already exists: " + username)
                    }
                    console.log("[debug] register error: " + response_text)
                }
            })
        })
    }

    GetProducts = async () => {
        let arr = []
        let products = await fetch(`${localStorage.getItem("url")}products/products`)
        let text = await (products.text());
        let object = await JSON.parse(text);
        object.forEach(data => {
            arr.push(data);
            console.log(`[debug] Product added to array: ${JSON.stringify(data)}`)
        })
        return arr

    }

    placeOrder = async (uid, id, amount) => {
        let order = await fetch(`${localStorage.getItem("url")}products/order/${uid}/${id}/${amount}`)
        let text = await order.text();
        if(text.split(' - ')[0] == 402) {
            alert("Login expired, please login again");
            console.log('[debug] ' + text)
            return;
        }
        if(text.split(' - ')[0] == 405) {
            alert("Order cancelled, not enough stock");
            console.log('[debug] ' + text)
            return;
        }
        alert("Order has been placed")
        console.log('[debug] placing order:' + text);
    }

    GetOrders =async (uid) => {
        console.log(`[debug] Secure Key: ${uid}`)
        let order = await fetch(`${localStorage.getItem("url")}orders/get/${uid}`)
        let text = await order.text();
        if(text.split(' - ')[0] == 404 || text.split(' - ')[0] == 402) {
            alert("Error fetching orders");
            console.log('[debug] ' + text);
            return {};
        }
        console.log(`[debug] order list: ${text}`)
        let json = JSON.parse(text);
        return json;
    }

}


