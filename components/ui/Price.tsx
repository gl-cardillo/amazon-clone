import { useContext } from "react";
import { CurrencyContext } from "../../utils/context";

// prices are stored in pounds and converted to the chosen currency
export default function Price({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);
  return (
    <span className={className}>
      {currencySymbol}
      {(Math.round(amount * currencyRate * 100) / 100).toFixed(2)}
    </span>
  );
}
