import SolidButton from "../../sections/solidButton";
import "../../static/css/components/shopCesta.css";
import { FaTrash } from "react-icons/fa";

const ShopCesta = ({
  items,
  totalPrice,
  totalAmount,
  onEmpty,
  onBuy,
  onRemoveItem,
  discount,
}) => {
  let total = totalPrice;
  if(discount!==null && discount!==undefined){
    total = (Math.round((totalPrice*(1-discount)) * 100) / 100).toFixed(2);
  }else{
    total = (Math.round(totalPrice * 100) / 100).toFixed(2);
  }
  total = total<0?0.0.toFixed(2):total;
  return (
    <div className="shop-cesta">
      <h2>Cesta</h2>
      <div className="shop-cesta-content">
        <div className="shop-cesta-items">
          <ul>
            {items.length !== 0 ? (
              items.map((item, index) => (
                <li key={index}>
                  <div className="shop-cesta-item">
                    <div className="shop-cesta-item__name">
                      <span>{item.name}</span>
                      <img
                        src={require("../../static/files/icons/flattercoins-icon.png")}
                        alt="Logo Flatter Coins"
                        style={{ width: "20px" }}
                      />
                      <span>x{item.count}</span>
                    </div>
                    <span style={{ marginRight: 0 }}>
                      {(Math.round(item.price * 100) / 100).toFixed(2)}€
                    </span>
                    <FaTrash
                      onClick={() => onRemoveItem(item.name, item.price)}
                      color="red"
                      className="shop-cesta-item__remove"
                    />
                  </div>
                </li>
              ))
            ) : (
              <li>No hay elementos en la cesta</li>
            )}
          </ul>
        </div>
        <div className="shop-cesta-total">
          <p style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ marginLeft: 0, marginRight: 0 }}>
              <strong>Cantidad total:</strong> {totalAmount}{" "}
            </span>
            <img
              src={require("../../static/files/icons/flattercoins-icon.png")}
              alt="Logo Flatter Coins"
              style={{ width: "20px", marginLeft: 4, marginRight: 0 }}
            />
          </p>
          <p>
            {discount!==null && discount!==undefined?<strong>Descuento: {(discount*100).toFixed(2)}%</strong>:<></>}
          </p>
          <p className="mt-1">
            <strong>Precio total:</strong> {total}€
          </p>
        </div>
        <div className="shop-cesta-buttons d-flex justify-content-between">
          <SolidButton text="Vaciar" type="featured" onClick={onEmpty} />
          <SolidButton text="Comprar" type="featured" onClick={onBuy} />
        </div>
      </div>
    </div>
  );
};

export default ShopCesta;
