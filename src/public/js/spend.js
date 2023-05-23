const getItems = fetch('shop/items.json')
  .then(response => response.json())
  .then(data => {return data.items;})
  .catch(e => console.error(e.message));
populateItems();

async function populateItems(){
  var items = await getItems;
  var select = document.getElementById('sort');
  var value = select.options[select.selectedIndex].value;

  // Sorts shop items by cost
  if(value == "priceLowHigh"){
    items.sort((a, b) => (a.cost > b.cost) ? 1 : -1);
  } else if(value == "priceHighLow"){
    items.sort((a, b) => (a.cost < b.cost) ? 1 : -1);
  } else if(value == "name"){
    items.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }

  var shop = document.getElementById("shopDiv");
  shop.innerHTML = "";

  items.forEach((item, i) => {
    try{
      var div = document.createElement('div');
      div.className = 'shopItem';
      var inner = '<img src="'+item.img+'" width=200px height=200px><br />';
      inner = inner+'<i>'+item.title+'</i><br />';
      inner = inner+item.cost+' points<br />';
      inner = inner+'<button class="btn" onclick="addToCart('+i+')">Add to Cart</button>';
      div.innerHTML = inner;
      shop.appendChild(div);
    } catch(err) {
      console.log("Element "+i+" could not load.")
    }

  });
}

async function addToCart(index) {
  const items = await getItems;
  var exists = document.getElementById(index);

  if (exists != null) {
    var qty = exists.getElementsByClassName("qtyValue")[0];
    var currentQty = parseInt(qty.textContent);
    qty.textContent = currentQty + 1;
    updateTotal();
    return;
  }


  // Otherwise, create a cart item entry
  var item = items[index];
  var cartDiv = document.getElementById("cartList");
  var div = document.createElement('div');
  div.className = "cartItem";
  div.id = index;
  div.innerHTML =  '<img src="'+item.img+'" width="50px" align="left" />';
  div.innerHTML += '<i>Item:</i> <span class="itemTitle">'+item.title+'</span> <br>';
  div.innerHTML += '<i>Cost:</i> <span class="itemCost">'+item.cost+'</span> <br>';
  div.innerHTML += '<i>Qty:</i> <button class="qty" onclick="decrementQty(this)">-</button> ';
  div.innerHTML += '<span class="qtyValue">1</span> ';
  div.innerHTML += '<button class="qty" onclick="incrementQty(this)">+</button><br><br>';
  div.innerHTML += '<button onClick="removeFromCart('+index+')">x</button>';
  cartDiv.appendChild(div);

  // Update total cost on page
  updateTotal();
}

function incrementQty(button) {
  var qtyValue = button.previousElementSibling;
  var qty = parseInt(qtyValue.textContent);
  qty++;
  qtyValue.textContent = qty;
  updateTotal();
}
function decrementQty(button) {
  var qtyValue = button.nextElementSibling;
  var qty = parseInt(qtyValue.textContent);
  if (qty > 1) {
    qty--;
    qtyValue.textContent = qty;
    updateTotal();
  }
}

function updateTotal() {
  var total = 0;
  var cart = document.getElementsByClassName("cartItem");
  for (let item of cart) {
    var cost = parseInt(item.getElementsByClassName("itemCost")[0].textContent);
    var qty = parseInt(item.getElementsByClassName("qtyValue")[0].textContent);
    total += cost * qty;
  }
  document.getElementById("totalCost").innerHTML = Math.round(total);
}

function removeFromCart(index){
  var div = document.getElementById(index);
  div.remove();
  updateTotal();
}

function clearCart(){
  var cart = Array.from(document.getElementsByClassName("cartItem"));
  for(let item of cart){
    item.remove();
  }
  document.getElementById("totalCost").innerHTML = 0;
}

function buy(){
  try{
    var cost = Number(document.getElementById("totalCost").innerHTML)
    if(cost == 0){
      throw new Error("Cart is empty!");
    }
  } catch(err){
    alert(err);
    console.error(err);
    return;
  } 
  addPoints(cost * -1).then(() => {
    clearCart();
    document.getElementById("buyErr").innerHTML = "";
    setTimeout(() => {window.location.href ='confirmation.html';}, 100);
  }).catch(e => {document.getElementById("buyErr").innerHTML = "Not enough points in account for purchase.";})
}
