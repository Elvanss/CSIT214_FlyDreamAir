getUserFromCookie().then(res => showName(res.fullName)).catch(e => {});
getUserFromCookie().then(res => showPoints(res.points)).catch(e => {});
getUserFromCookie().then(res => showUsername(res.username)).catch(e => {});


function showName(name){
    document.getElementById("name").innerHTML = name;
}

function showPoints(points){
    document.getElementById("points").innerHTML = points;
}

function showUsername(un){
    document.getElementById("username").innerHTML = un;
}

async function changeName() {
    if (document.getElementById("user_change").value === '') {
        return;
    }

    var user = await getUserFromCookie();
    var users = await getUsers;
    var userIndex = users.findIndex(u => u.username === user.username);
    users[userIndex].fullName = document.getElementById("user_change").value;
    updateUsers(users);

    // Update the name element on the screen
    var nameElement = document.getElementById("name");
    nameElement.textContent = users[userIndex].fullName;

    // Show the success popup
    var popup1 = document.getElementById('popup-1');
    popup1.style.display = 'flex';

    // Close the popup after clicking the close button
    var closeButton = document.getElementById('close-button');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            popup1.style.display = 'none';
            document.getElementById("user_change").value = "";
        });
    }
}

async function changePassword() {
  if (document.getElementById("repwd").value === '') {
      return;
  }
  
  var user = await getUserFromCookie();
  var users = await getUsers;
  var userIndex = users.findIndex(u => u.username === user.username);
  
  try {
      if (document.getElementById("pwd").value === document.getElementById("repwd").value) {
          users[userIndex].password = document.getElementById("pwd").value;
      } else {
          throw new Error("Passwords don't match!");
      }
  } catch (e) {
      console.log(e);
      document.getElementById("pwdErr").textContent = "Passwords don't match!";
      return;
  }
  
  updateUsers(users);
  
  // Show the success popup
  var popup1 = document.getElementById('change-password');
  popup1.style.display = 'flex';
  
  // Close the popup after clicking the close button
  var closeButton1 = document.getElementById('close-button1');
  if (closeButton1) {
      closeButton1.addEventListener('click', function() {
          popup1.style.display = 'none';
          
          // Clear password fields
          document.getElementById("pwd").value = "";
          document.getElementById("repwd").value = "";
      });
  }
}


async function deleteAccount() {
    var user = await getUserFromCookie();
    var users = await getUsers;
    var userIndex = users.findIndex(u => u.username === user.username);
    var newUsers = [];
    for(var i = 0; i < users.length; i++){
        if(i === userIndex){
            continue;
        }
        newUsers.push(users[i]);
    }
    users.splice(userIndex, 1)
    console.log(newUsers)
    updateUsers(users);
    // wait for data to be written before refreshing the page
    setTimeout(() => window.location.href = "login.html", 200);
}