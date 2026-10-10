import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { UserContext, CurrencyContext } from "../utils/context";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Cart() {
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);
  const { user, setUser, authReady } = useContext(UserContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cart, setCart] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  // id of the product that hit the quantity limit
  const [limitReachedId, setLimitReachedId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      router.push("/signin");
      return;
    }

    const getCart = async () => {
      try {
        const response = await axios.get("/api/cart/getCartProduct");
        const { cart } = response.data;
        setCart(cart);
        setCartQuantity(cart.reduce((accum, cart) => accum + cart.quantity, 0));
        const price = cart
          .map((productCart) => {
            return productCart.product.price * productCart.quantity;
          })
          .reduce((a, b) => a + b, 0);
        setTotalPrice(price);
      } catch (error) {
        console.log(error);
      }
    };

    getCart();
  }, [user, authReady]);

  const updateQuantity = async (productId, quantity, n) => {
    if (quantity === 1 && n === "-1") {
      removeProduct(productId);
      return;
    }
    if (quantity === 9 && n === "+1") {
      setLimitReachedId(productId);
      return;
    }
    setDisableButton(true);
    try {
      const response = await axios.put("/api/cart/addToCart", { productId, n });
      setUser(response.data);
      localStorage.setItem("user_amazon_lc", JSON.stringify(response.data));
      setLimitReachedId(null);
    } catch (error) {
      console.log(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  const removeProduct = async (productId) => {
    setDisableButton(true);
    try {
      // axios.delete takes the body under `data`
      const response = await axios.delete("/api/cart/addToCart", {
        data: { productId },
      });
      setUser(response.data);
      localStorage.setItem("user_amazon_lc", JSON.stringify(response.data));
      setLimitReachedId(null);
    } catch (error) {
      console.log(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  return (
    <div className="m-5 p-2 py-5 bg-white shadow rounded-md flex flex-col sm:mx-6 md:mx-20 md:px-10 lg:mx-40 xl:mx-[400px] 2xl:mx-[500px] 3xl:mx-[600px] ">
      <h2 className="font-bold text-xl text-gray-700 -ml-2">Shopping Basket</h2>
      <div>
        {cart ? (
          cart.length > 0 ? (
            <div>
              {cart.map((productCart, index) => {
                return (
                  <div
                    key={index}
                    className="flex min-h-[100px] justify-between my-5 py-2 border-b border-slate-200 "
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-[100px] flex item-center justify-center">
                        <img
                          src={productCart.product.picUrl}
                          className="min-w-[50px] h-[70px]"
                        />
                      </div>
                      <div className="flex gap-5 flex-col">
                        <Link href={`/product/${productCart.product._id}`}>
                          <a>
                            <h3 className="text-sm font-semibold">
                              {productCart.product.name}
                            </h3>
                          </a>
                        </Link>
                        <div>
                          <div className="flex gap-2 items-center">
                            <div className="flex gap-3 px-1 text-sm border-solid border-2 border-slate-300 rounded-2xl">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    productCart.product._id,
                                    productCart.quantity,
                                    "-1"
                                  )
                                }
                                disabled={disableButton}
                              >
                                -
                              </button>
                              <p>{productCart.quantity}</p>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    productCart.product._id,
                                    productCart.quantity,
                                    "+1"
                                  )
                                }
                                disabled={disableButton}
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                removeProduct(productCart.product._id)
                              }
                              disabled={disableButton}
                              className="text-sm text-blue-500"
                            >
                              Remove
                            </button>
                          </div>
                          {limitReachedId === productCart.product._id && (
                            <p className="text-red-500 text-[12px]">
                              The limit is 9
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="font-bold text-sm">
                      {currencySymbol}
                      {(
                        Math.round(
                          productCart.product.price * currencyRate * 100
                        ) / 100
                      ).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 py-3">
              <p>Basket is empty</p>
              <div>
                <button
                  onClick={() => router.push("/")}
                  className="mt-1 p-1 w-[120px] text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                >
                  Go to shopping!
                </button>
              </div>
            </div>
          )
        ) : (
          <Skeleton height={100} count={3} />
        )}
      </div>
      <div className="flex gap-1 items-center self-end ">
        <p className="text-sm">{`Subtotal (${cartQuantity} items):`}</p>
        <p className="font-bold">
          {currencySymbol}
          {(Math.round(totalPrice * currencyRate * 100) / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
