import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../utils/userContext";
export default function Cart() {
  const { user, setUser } = useContext(UserContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getCart = async () => {
      axios
        .get("http://localhost:3000/api/cart/getCartProduct", {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token_amazon_lc")
            )}`,
          },
        })
        .then((res) => {
          setCart(res.data.cart);
          console.log(res.data.cart);
          setCartQuantity(
            res.data.cart.reduce((accum, cart) => accum + cart.quantity, 0)
          );
          const price = res.data.cart
            .map((productCart) => {
              return productCart.product.price * productCart.quantity;
            })
            .reduce((a, b) => a + b, 0);
          setTotalPrice(price);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCart();
  }, [user]);

  return (
    <div className="m-2 p-2 py-5 bg-white rounded-md flex flex-col md:mx-20 md:px-10 lg:mx-40 ">
      <h2 className="font-bold text-xl">Shopping Basket</h2>
      <div>
        {cart.length > 0 ? (
          <div>
            {cart.map((productCart, index) => {
              return (
                <div
                  key={index}
                  className="flex min-h-[100px] justify-between my-5 py-2 border-b-2 border-slate-300 "
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={productCart.product.picUrl}
                      className="w-[50px] h-[50px]"
                    ></img>
                    <div className="flex gap-5 flex-col">
                      <h3 className="text-sm">{productCart.product.name}</h3>
                      <div className="flex gap-2 items-center">
                        <div className="flex gap-3 px-1 text-sm border-solid border-2  border-slate-400 rounded-2xl">
                          <p onClick={() => decreaseQuantity()}>-</p>
                          <p>{productCart.quantity}</p>
                          <p onClick={() => increaseQuantity()}>+</p>
                        </div>
                        <p className="text-sm text-blue-500">Delete</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>price</p>
                    <p className="font-bold text-sm">
                      {productCart.product.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          "Cart is empty"
        )}
      </div>
      <div className="flex gap-1 items-center self-end ">
        <p className="text-sm">{`Subtotal (${cartQuantity} items):`}</p>
             <p className="font-bold"> {totalPrice}
  </p>
      </div>
    </div>
  );
}
