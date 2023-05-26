const EXPIRE_TIME_MINS = 30;

// gets users object from user.json when called
const getUsers = fetch('users.json')
	.then(response => response.json())
	.then(data => {return data;});

function clearCookie(){
	document.cookie = "username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
}  

async function checkLogin(){
	const users = await getUsers;

	var tempUn = document.getElementById("un").value;
	var tempPw = document.getElementById("pw").value;

	try{
		if(tempUn == '' || tempPw == ''){
			throw new Error("Username or Password fields blank");
		}
		var userIndex;
		var found = false;
		for(var i = 0; i < users.length; i++){
			if(users[i].username === tempUn && users[i].password === tempPw){
				found = true;
				userIndex = i;
				break;
			}
		}
		if(!found){
			document.getElementById("passCheck").innerHTML = "Username or password is not correct.";
			throw new Error("Username or Password not found!")
		}
	} catch(e){
		console.error(e.message, e.name);
		return
	}

	//get date five minutes from now (cookie expiry date)
	setCookie(tempUn);
	//redirect to main page
	location.href = "main.html";
}

async function createUser(){
	var users = await getUsers;

	var fullname = document.getElementById("name").value;
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;

	// check if these credentials already exist
	for(var i = 0; i < users.length; i++) {
	try{      
		if(users[i].username === username){
			throw new Error('User already exists');
		}
	} catch(e){
		console.error(e.message, e.name);
		document.getElementById('userCheck').innerHTML = "Username already exists";
		return;
		}
	}

	const newUser = { 	"username":username, 
						"fullName": fullname, 
						"password":password,
						"points":0 };
	// add new user to the end of user array
	users.push(newUser);
	updateUsers(users);
	setCookie(username);
	
	setTimeout(() => window.location.href = "main.html", 200);
}

function signOut(){
	clearCookie()
	window.location.href = "login.html";
}

function setCookie(username){
	var expire = new Date();
	//login is valid for 30 minutes
	expire.setMinutes(expire.getMinutes() + EXPIRE_TIME_MINS);
	// create a cookie from username
	document.cookie = "username="+username+"; Path=/; Expires="+expire.toUTCString()+";";
}

async function getUserFromCookie(){
	var cookie = document.cookie
	
	try{
		var username = cookie.split("=")[1];
		if(username == null){
			throw new Error("No user present in cookie");
		}
	} catch(e){
		console.error(e.message, e.name);
		window.location.href = "login.html"
		return null;
	}

	const users = await getUsers;
	var u;
	for(var i = 0; i < users.length; i++){
		if(users[i].username == username){
			u = users[i];
			break;
		}
	}
	return u
}

function updateUsers(users) {
	var userJson = JSON.stringify(users);
  
	fetch('/users.json', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  body: userJson
	})
	.then(res => res.text())
	.then(data => console.log("Data was sent", data))
	.catch((error) => console.error("Didn't send: ", error));
  }
  

async function addPoints(points){
	var users = await getUsers;
	var user = await getUserFromCookie();
	if(user == null){
		window.location.href = "login.html"
		throw new Error("User not logged in or cookie expired")
	} else if((Number(user.points) + Number(points)) < 0){
	// in the case of adding negative points (buying items)
		throw new Error("Not enough points");	
	}
	points += Number(user.points);

	user.points = points;
	console.log(points, Number(user.points));

	for(u in users){
		if(u.username === user.username && u.password === user.password){
			u.points = points;
		}
	}
	updateUsers(users);
}

async function getPoints(){
	try{
		var user = await getUserFromCookie();
		if(user == null){
			throw new Error("User not logged in or cookie expired")
		} 
	} catch(err){
		console.error(err);
		window.location.href = "login.html"
		return;
	}
	return (Number(user.points));
}

// Function to determine the rank based on points
async function getRank() {
	try {
	  const user = await getUserFromCookie();
  
	  if (user == null) {
		return { rank: 'No Rank', image: '' };
	  }
  
	  const points = user.points;
  
	  if (points >= 100 && points <= 5000) {
		return { rank: 'Bronze', image: '/image/bronze.png' };
	  } else if (points >= 5001 && points <= 10000) {
		return { rank: 'Silver', image: '/image/silver.png' };
	  } else if (points >= 10001) {
		return { rank: 'Gold', image: '/image/gold.png' };
	  } else {
		return { rank: 'No Rank', image: '' };
	  }
	} catch (error) {
	  console.error(error);
	  return { rank: 'No Rank', image: '' };
	}
  }
  
//   Update the rank and image elements with the appropriate values
async function updateRank() {
	try {
	  const { rank, image } = await getRank();
  
	  const rankDiv = document.getElementById('rank');
	  const rankImage = document.getElementById('rankImage');
  
	  rankDiv.textContent = `Your Rank: ${rank}`;
	  rankImage.src = image;
  
	  if (image === '') {
		rankImage.style.display = 'none';
	  }
	} catch (error) {
	  console.error('Error:', error);
	}
  }
  

