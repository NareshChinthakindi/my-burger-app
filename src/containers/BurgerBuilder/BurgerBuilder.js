import React,{Component} from 'react';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
          salad:0.5,
           bacon:0.7,
           cheese:0.4,
           meat:1.3
};

class BurgerBuilder extends Component {

   state = {
       ingredients:null,
       totalPrice:4,
       purchaseable:false,
       purchasing:false,
       loading:false

   }

   componentDidMount() {
       axios.get('https://my-react-burger-9aae4.firebaseio.com/ingredients.json').then(response =>{

       this.setState({ingredients:response.data});

       })
   }

   updatePurchaseState(ingredients) {
      
       const sum = Object.keys(ingredients)
                      .map(igKey =>{
                          return ingredients[igKey];
                      })
                      .reduce((sum, el) =>{
                          return sum + el;
                      },0);

        this.setState({purchaseable:sum > 0});              

   }

   addIngredientHandler= (type) =>{
       const oldCount = this.state.ingredients[type];
const updatedCount = oldCount + 1;
const updatedIngredients = {
    ...this.state.ingredients
}

updatedIngredients[type] = updatedCount;
const priceAddtion = INGREDIENT_PRICES[type];
const oldPrice = this.state.totalPrice;
const newPrice = oldPrice + priceAddtion;

this.setState({totalPrice:newPrice, ingredients:updatedIngredients})
this.updatePurchaseState(updatedIngredients);

   };

   removeIngridentHandler = (type) =>{
    const oldCount = this.state.ingredients[type];
    
      if(oldCount <= 0) {
          return;
      }

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        
        updatedIngredients[type] = updatedCount;
        const priceAddtion = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceAddtion;
        
        this.setState({totalPrice:newPrice, ingredients:updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    
    
   }

   purchasingHandler =() =>{
       this.setState({purchasing:true});
   }

   purchasingCancelHandler =() =>{
      this.setState({purchasing:false});
}

purchaseContinue = () =>{
    //alert('You Continued');
    this.setState({loading:true});
    const order = {
        ingredients:this.state.ingredients,
        price:this.state.totalPrice,
        customer:{
            name:'Naresh',
            address:{
                street:'Test',
                zipCode:'23432432',
                country:'JK'
            },
            email:'test@test.com'
        },
        deliveryMethod:'fatest'
    }
    axios.post('/orders.json', order)
    .then(response => 
        {console.log(response)
            this.setState({loading:true, purchasing:false});
        })
    .catch(error =>
        {console.log(error)
            this.setState({loading:true, purchasing:false});
        });
}

render() {

    const disabledInfo = {
        ...this.state.ingredients
    };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <=0;
    }

    let orderSummary = null;

   

    let burger = <Spinner />;

    if (this.state.ingredients) {
        burger = (
       <Auxiliary>
       <Burger ingredients={this.state.ingredients}/>
       <BuildControls 
       ingredientAdded={this.addIngredientHandler}
       ingredientRemoved={this.removeIngridentHandler}
        disabled={disabledInfo}
        price={this.state.totalPrice}
        purchaseable={this.state.purchaseable}
        ordered={this.purchasingHandler}
       /></Auxiliary>);

       orderSummary = <OrderSummary ingredients={this.state.ingredients}
    purchaseCancelled={this.purchasingCancelHandler}
    purchaseContinue={this.purchaseContinue}  
    price={this.state.totalPrice}
/>;
    }

    if(this.state.loading) {
        orderSummary = <Spinner/>
   }
    return (
       <Auxiliary>
           
           <Modal show={this.state.purchasing} modalClosed={this.purchasingCancelHandler}>
           
                {orderSummary}

           </Modal> 
           {burger}
       </Auxiliary>

    );
}

}

export default withErrorHandler(BurgerBuilder,axios);