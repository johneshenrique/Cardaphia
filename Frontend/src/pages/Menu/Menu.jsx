import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Header from '../../components/Header/Header';
import List from '../../components/List/List';
import Order from '../../classes/Order';
import PopUp from '../../components/PopUp/PopUp';
import PopUpDetails from '../../components/PopUpDetails/PopUpDetails'

import { getMenu, getDish, finishOrder } from '../../services/clientes.service';

import arrowLeft from '../../assets/arrowLeft.svg'
import './Menu.css'

function Menu () {
  const history = useHistory();
  
  const restaurantID = Number(localStorage.getItem('restaurantID'));
  const tableCode = localStorage.getItem('tableCode');

  if (!tableCode) {
    history.push('/');
  }
  
  const order = new Order(tableCode, restaurantID);

  const [ isFinalized, finalize ] = useState(false)
  const [ orderRealized, setOrderRealized ] = useState({});
  const [ dishes, setDishes ] = useState([]);

  const [click, setClick ] = useState(false);
  const [dishDetails, setDishDetails ] = useState({});

  useEffect(() => {
    getMenu(restaurantID)
      .then(response => setDishes(response.data))
      .catch(error => console.log(error)); 
  }, [restaurantID]);

  function finalizeOrder(order) {
    setOrderRealized(order);
    
    const response = {
      request: orderRealized,
      success: "Pedido realizado com suceso",
    };
    
    alert(response.success);
    finalize(false);

    finishOrder(restaurantID, orderRealized)
    
    localStorage.setItem('orderId', order.orderNumber);
    
    history.push('/waiting');
  }

  function ShowPopUp(order) {
    setOrderRealized(order);

    finalize(true);
  }
  
    function abortOrder() {
      finalize(false);
    }

  function showDetails(dishId){
    getDish(restaurantID, dishId).then(response => {
      setDishDetails(response.data);
    });

    setClick(true);
  }

  function abortShowDetails(dish){
    setClick(false);
  }

  return (
    <section className="container" id="menu"> 
      <Link to="/"><img src={arrowLeft} alt="voltar"/></Link>
      
      <Header
        subtitle="Cardápio"
      />

      <List
        dishes={dishes}
        order={order}
        ShowPopUp={ShowPopUp}
        showDetails={showDetails}
      />
      
      {click
      ? (
      <PopUpDetails
        dish={dishDetails}
        abortShowDetails={abortShowDetails}
      />)
      : (<></>)}
  
      {isFinalized
      ? (
      <PopUp
        order={orderRealized}
        finalizeOrder={finalizeOrder}
        abortOrder={abortOrder}
      />)
      : (<></>)}
       
    </section>
  );
}
 
export default Menu;