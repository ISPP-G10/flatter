import "../../static/css/components/shopOption.css";

const ShopOption = ({ name, extra, price, onClick, style }) => {
  return (
    <div className="shop-option" style={style} onClick={onClick}>
      <h3 className="price">{(Math.round(price * 100) / 100).toFixed(2)}€</h3>
      <br />
      <br />
      <div className="shop-option__content">
        <img
          src={require("../../static/files/icons/flattercoins-icon.png")}
          alt="Logo Flatter Coins"
          style={{ width: "40px", height: "40px" }}
        />
        <span>{name + extra}</span>
        <div className="shop-option-footer">
          <p>{name} FlatterCoins</p>
          <p className="extra-amount">+ {extra} FlatterCoins adicionales</p>
        </div>
      </div>
    </div>
  );
};

export default ShopOption;
