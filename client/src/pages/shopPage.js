import ShopCesta from "../components/shop/shopCesta";
import ShopOption from "../components/shop/shopOption";
import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/shopPage.css";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import PaymentModal from "../components/paymentModal";
import customAlert from "../libs/functions/customAlert";

const ShopPage = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState(0);

  const paymentModal = useRef(null);

  const handleAdd = (name, price) => {
    // Comprobar si el item ya está en la cesta
    const itemIndex = items.findIndex((item) => item.name === name);
    if (itemIndex === -1) {
      // Si no está, añadirlo con contador a uno
      setItems([...items, { name: name, price: price, count: 1 }]);
    } else {
      // Si está, incrementar el contador
      items[itemIndex].count++;
      setItems([...items]);
    }
    // Actualizar el total
    setTotal(total + price);
    setAmount(amount + name);
  };

  const handleEmpty = () => {
    setItems([]);
    setTotal(0);
    setAmount(0);
  };

  const handleRemoveItem = (name, price) => {
    // Comprobar si el item ya está en la cesta
    const itemIndex = items.findIndex((item) => item.name === name);
    if (itemIndex !== -1) {
      // Si está, decrementar el contador
      items[itemIndex].count--;
      if (items[itemIndex].count === 0) {
        // Si el contador es 0, eliminar el item
        items.splice(itemIndex, 1);
      }
      setItems([...items]);
      // Actualizar el total
      setTotal(total - price);
      setAmount(amount - name);
    }
  };

  function handlePayment() {
    paymentModal.current.open();
  }

  function handleCorrectPayment() {
    customAlert("El pago se ha realizado correctamente");
  }

  function handleBadPayment() {
    customAlert("El pago no se ha realizado correctamente");
  }

  return (
    <FlatterPage withBackground userLogged>
      <div className="shop-page-container">
        <div>
          <h1 className="properties-title">Tienda</h1>
        </div>
        <div className="shop-page-content">
          <div className="shop-options">
            <ShopOption
              name={100}
              price={1}
              extra={0}
              onClick={() => handleAdd(100, 1)}
            />
            <ShopOption
              name={275}
              extra={25}
              price={2.5}
              onClick={() => handleAdd(300, 2.5)}
            />
            <ShopOption
              name={575}
              extra={75}
              price={5}
              onClick={() => handleAdd(650, 5)}
            />
            <ShopOption
              name={1200}
              extra={200}
              price={10}
              onClick={() => handleAdd(1400, 10)}
            />
          </div>
          <ShopCesta
            items={items}
            totalPrice={total}
            totalAmount={amount}
            onEmpty={handleEmpty}
            onBuy={handlePayment}
            onRemoveItem={handleRemoveItem}
          />
        </div>
        <PaymentModal
          price={total}
          resolve={handleCorrectPayment}
          reject={handleBadPayment}
          ref={paymentModal}
        />
      </div>
    </FlatterPage>
  );
};

ShopPage.propTypes = {
  price: PropTypes.number,
};

export default ShopPage;
