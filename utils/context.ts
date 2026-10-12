import { createContext, type Dispatch, type SetStateAction } from "react";
import type { User } from "@/types";

export interface UserContextValue {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  // false until the user has been restored from localStorage
  authReady: boolean;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
  authReady: false,
});

export type CurrencySymbol = "£" | "€" | "$";

export interface CurrencyContextValue {
  currencySymbol: CurrencySymbol;
  setCurrencySymbol: Dispatch<SetStateAction<CurrencySymbol>>;
  currencyRate: number;
  setCurrencyRate: Dispatch<SetStateAction<number>>;
}

export const CurrencyContext = createContext<CurrencyContextValue>({
  currencySymbol: "£",
  setCurrencySymbol: () => {},
  currencyRate: 1,
  setCurrencyRate: () => {},
});
