import ShopCesta from "../components/shop/shopCesta";
import ShopOption from "../components/shop/shopOption";
import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/shopPage.css";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import PaymentModal from "../components/paymentModal";
import customAlert from "../libs/functions/customAlert";
import { useApolloClient } from "@apollo/client";
import usersAPI from "../api/usersAPI";
import FlatterForm from "../components/forms/flatterForm";
import { couponFormInputs } from "../forms/couponForm";

const ShopPage = () => {

  const client = useApolloClient();
  const couponFormRef = useRef(null);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [discount, setDiscount] = useState(null);

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
    client.mutate({
      mutation: usersAPI.editUserFlatterCoins,
      variables: {
        username: localStorage.getItem("user"),
        token: localStorage.getItem("token"),
        flatterCoins: amount,
      }
    })
    .then(response => {
      customAlert("¡Has añadido correctamente las FlatterCoins a tu cuenta!", 'success', false);
      handleEmpty();
      setDiscount(null);
      window.location.reload();
    })
    .catch(error => {
      customAlert("Ha ocurrido un error al añadir las flatterCoins a tu cuenta. Por favor, contacta con nuestro equipo de soporte", 'error', false);
    });
  }

  function handleBadPayment() {
    customAlert("Se ha cancelado el pago", 'warning', false, 10000);
  }

  function handleCorrectRedeem({values}) {

    if(!couponFormRef.current.validate()) return;

    client.mutate({
      mutation: usersAPI.redeemPromotion,
      variables: {
        username: localStorage.getItem("user"),
        token: localStorage.getItem("token"),
        code: values.code,
      }
    }).then(response => {
      if (response.data.redeemPromotion.promotion.isDiscount === false) {
        customAlert("¡Has canjeado correctamente el cupón!", 'success', false);
        window.location.reload();
      } else {
        setDiscount(response.data.redeemPromotion.promotion.quantity);
        customAlert("Se ha aplicado el descuento correctamente", 'success', false);
      }
    }).catch(error => {
      let errorMessage = error.message.split("\n")[0];
      if(errorMessage === "El código ya no está activo" || errorMessage === "Ya has canjeado el código" || errorMessage === "El código introducido no existe") {
        customAlert(errorMessage, 'warning', false);
      }else{
        customAlert(errorMessage, 'error', false);
      }
    });

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
              price={2.5}
              extra={0}
              style={{
                background:
                  "linear-gradient(90deg, #7dd3fc 0%, #38bdf8 100%)",
              }}
              onClick={() => handleAdd(100, 2.5)}
            />
            <ShopOption
              name={275}
              extra={25}
              price={5.55}
              style={{
                background:
                  "linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)",
              }}
              onClick={() => handleAdd(300, 5.55)}
            />
            <ShopOption
              name={575}
              extra={75}
              price={9.99}
              style={{
                background:
                  "linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)",
              }}
              onClick={() => handleAdd(650, 9.99)}
            />
            <ShopOption
              name={1200}
              extra={200}
              price={19.99}
              style={{
                background:
                  "linear-gradient(90deg, #0284c7 0%, #0369a1 100%)",
              }}
              onClick={() => handleAdd(1400, 19.99)}
            />
            <ShopOption
              name={2500}
              extra={500}
              price={39.99}
              style={{
                background:
                  "linear-gradient(90deg, #0369a1 0%, #075985 100%)",
              }}
              onClick={() => handleAdd(3000, 39.99)}
            />
            <ShopOption
              name={5000}
              extra={1000}
              price={69.99}
              style={{
                background:
                  "linear-gradient(90deg, #075985 0%, #0c4a6e 100%)",
              }}
              onClick={() => handleAdd(6000, 69.99)}
            />
          </div>
          <div className="w-50 ml-5">
            <div className="shop-cesta mb-4 d-flex flex-column justify-content-center align-items-center">
              <h2>Aplica tu cupón aquí</h2>
              <div className="shop-cesta-buttons w-100">
                <FlatterForm
                  inputs={couponFormInputs}
                  onSubmit= {handleCorrectRedeem}
                  buttonText="Aplicar"
                  showSuperAnimatedButton={false}
                  ref={couponFormRef}
                />
              </div>
            </div>
            
            <ShopCesta
              items={items}
              totalPrice={total}
              totalAmount={amount}
              onEmpty={handleEmpty}
              onBuy={handlePayment}
              onRemoveItem={handleRemoveItem}
              discount={discount}
            />
          </div>
        </div>
        <PaymentModal
          price={total}
          resolve={handleCorrectPayment}
          reject={handleBadPayment}
          ref={paymentModal}
          discount={discount}
        />
      </div>
    </FlatterPage>
  );
};

ShopPage.propTypes = {
  price: PropTypes.number,
};

export default ShopPage;
