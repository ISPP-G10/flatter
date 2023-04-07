import SolidButton from "../../sections/solidButton";
import "../../static/css/components/shopOption.css";

const ShopOption = ({ name, extra, price, onClick }) => {
  return (
    <div className="shop-option">
      <div className="shop-option__content">
        <h2>
          {extra === undefined ? (
            <span>{name}</span>
          ) : (
            <span>
              {name - extra} (+{extra})
            </span>
          )}
          <img
            src={require("../../static/files/icons/flattercoins-icon.png")}
            alt="Logo Flatter Coins"
          />
        </h2>
        <h3 className="price">{(Math.round(price * 100) / 100).toFixed(2)}€</h3>
        <SolidButton text="Añadir a la cesta" onClick={onClick} />
      </div>
    </div>
  );
};

export default ShopOption;
