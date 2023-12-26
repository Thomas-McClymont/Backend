const obtenerIdCarrito = async () => {
  try {
    const response = await fetch("/api/carts/usuario/carrito", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Error getting cart ID");
      return null;
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.log("Error getting cart ID", error);
    return null;
  }
};

const agregarProductoAlCarrito = async (pid) => {
  try {
    const cid = await obtenerIdCarrito();
    if (!cid) {
      console.error("Invalid cart ID.");
      return;
    }
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    }).then((response) => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Product added",
          text: `Check cart 🛒`,
        });
        return res.json();
      } else {
        throw new Error("Something went wrong");
      }
    });
    if (!response.ok) {
      console.log("Error adding product to cart");
      return;
    }
    console.log("Product added to cart");
  } catch (error) {
    console.log("Error adding product to cart" + error);
  }
};

// MAKE PURCHASE
async function realizarCompra() {
  try {
    const cid = await obtenerIdCarrito();
    if (!cid) {
      console.error("Cart not found");
      return;
    }
    const response = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Purchase succesful",
            text: "Check you email to see details of your purchase",
          });
          return res.json();
        } else {
          throw new Error("Failed to purchase cart.");
        }
      })
      .then((data) => {
        console.log(data);
        const ticketCode = data.ticket._id;
        window.location.href = `/tickets/${ticketCode}`;
      });
    if (!response.ok) {
      console.error("Error making purchase");
      return;
    }
    console.log("Purchase successful");
  } catch (error) {
    console.error("Error making purchase", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cartButton");
  if (cartButton) {
    cartButton.addEventListener("click", async () => {
      try {
        const cid = await obtenerIdCarrito();
        if (cid) {
          window.location.assign(`/carts/`);
        } else {
          console.error("Invalid cart ID");
        }
      } catch (error) {
        console.error("Error getting cart ID: " + error);
      }
      e.preventDefault();
    });
  }
});
