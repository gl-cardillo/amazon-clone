import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { CurrencyContext } from "../utils/context";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMe } from "../hooks/useAuth";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
  type CartStep,
} from "../hooks/useCart";
import { MAX_CART_QUANTITY } from "../utils/constants";

export default function Cart() {
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);
  const { user, isLoading } = useMe();
  const { data: cart } = useCart();
  const updateCartQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();
  // id of the product that hit the quantity limit
  const [limitReachedId, setLimitReachedId] = useState<string | null>(null);
  const router = useRouter();
  // one change at a time, concurrent saves of the same user would conflict
  const disableButton =
    updateCartQuantity.isPending || removeFromCart.isPending;

  const cartQuantity = (cart ?? []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalPrice = (cart ?? []).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [isLoading, user, router]);

  const removeProduct = (productId: string) => {
    setLimitReachedId(null);
    removeFromCart.mutate(productId);
  };

  const updateQuantity = (productId: string, quantity: number, n: CartStep) => {
    if (quantity === 1 && n === "-1") {
      removeProduct(productId);
      return;
    }
    if (quantity === MAX_CART_QUANTITY && n === "+1") {
      setLimitReachedId(productId);
      return;
    }
    setLimitReachedId(null);
    updateCartQuantity.mutate({ productId, n });
  };

  return (
    <div className="m-5 flex flex-col rounded-md bg-white p-2 py-5 shadow sm:mx-6 md:mx-20 md:px-10 lg:mx-40 xl:mx-[400px] 2xl:mx-[500px] 3xl:mx-[600px]">
      <h2 className="-ml-2 text-xl font-bold text-gray-700">Shopping Basket</h2>
      <div>
        {cart ? (
          cart.length > 0 ? (
            <div>
              {cart.map((productCart) => {
                return (
                  <div
                    key={productCart.product._id}
                    className="my-5 flex min-h-[100px] justify-between border-b border-slate-200 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="item-center flex w-[100px] justify-center">
                        <Image
                          src={productCart.product.picUrl}
                          width={50}
                          height={70}
                          className="h-[70px] w-auto min-w-[50px] object-contain"
                          alt={productCart.product.name}
                        />
                      </div>
                      <div className="flex flex-col gap-5">
                        <Link href={`/product/${productCart.product._id}`}>
                          <h3 className="text-sm font-semibold">
                            {productCart.product.name}
                          </h3>
                        </Link>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-3 rounded-2xl border-2 border-solid border-slate-300 px-1 text-sm">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    productCart.product._id,
                                    productCart.quantity,
                                    "-1",
                                  )
                                }
                                disabled={disableButton}
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <p>{productCart.quantity}</p>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    productCart.product._id,
                                    productCart.quantity,
                                    "+1",
                                  )
                                }
                                disabled={disableButton}
                                aria-label="Increase quantity"
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
                            <p className="text-[12px] text-red-500">
                              The limit is {MAX_CART_QUANTITY}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-bold">
                      {currencySymbol}
                      {(
                        Math.round(
                          productCart.product.price * currencyRate * 100,
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
                  className="mt-1 w-[120px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] p-1 text-[14px]"
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
      <div className="flex items-center gap-1 self-end">
        <p className="text-sm">{`Subtotal (${cartQuantity} items):`}</p>
        <p className="font-bold">
          {currencySymbol}
          {(Math.round(totalPrice * currencyRate * 100) / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
