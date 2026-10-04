/*
|--------------------------------------------------------------------------
| formatPrice
|--------------------------------------------------------------------------
| Formats a price consistently throughout the Fernwood application.
|
| Example:
| formatPrice(12500)
| → "12,500.00 ETB"
|--------------------------------------------------------------------------
*/

const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "0.00 ETB";
  }

  return `${numericPrice.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ETB`;
};

export default formatPrice;