import { createContext, type Dispatch, type SetStateAction } from "react";

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
