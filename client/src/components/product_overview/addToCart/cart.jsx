import React from 'react';
import Option from './option.jsx';
import axios from 'axios';
import { IoIosStarOutline, IoIosStar} from 'react-icons/io';


class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableSizes: [],
      availableQuantities: [],
      selectedSize: 'TBD',
      selectedQuantity: 'TBD',
      size: 'SELECT SIZE'
    };
  }

  componentDidMount() {
    this.setAvailableSizes();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedStyle !== this.props.selectedStyle) {
      this.setState({size: 'SELECT SIZE'}, () => {
        this.setAvailableSizes();
        this.resetForm();
      });
    }
  }

  resetForm() {
    document.getElementById('cart-form').reset();
  }

  setAvailableSizes() {
    let skus = this.props.selectedStyle.skus;
    let sizes = [];
    for (let key in skus) {
      if (skus[key].quantity && skus[key].quantity > 0) {
        sizes.push(skus[key].size);
      }
    }
    if (sizes.length === 0) {
      document.getElementById('select-target').options.length = 1;
      this.setState({ size: 'OUT OF STOCK'});
    } else {
      this.setState({ availableSizes: sizes } );
      document.getElementById('quantity').innerHTML = '-';
    }
  }

  determineQuantityFromSelectedSize() {
    let skus = this.props.selectedStyle.skus;
    let quantities = [];
    for (let key in skus) {
      if (skus[key].size === this.state.selectedSize) {
        for (var i = 1; i <= skus[key].quantity; i++) {
          if (i > 15) {
            break;
          }
          quantities.push(i);
        }
      }
    }
    this.setAvailableQuantities(quantities);
    this.setState({ selectedQuantity: 1 });

    let quantitySelectElement = document.getElementById('quantity');
    quantitySelectElement.innerHTML = '1';
    return this.setAvailableQuantities(quantities);
  }

  setAvailableQuantities(quantities) {
    this.setState({ availableQuantities: quantities} );
  }

  setSizeSelection(e) {
    let selectedSize = e.target.value;
    this.setState({ selectedSize }, () => {
      this.determineQuantityFromSelectedSize();
    });
  }

  setQuantitySelection(e) {
    let selectedQuantity = e.target.value;
    this.setState( {selectedQuantity} );
  }

  handleAddToMyOutfit() {
    this.props.toggleOutfit(this.props.productId);
  }

  cartHandler(e) {
    e.preventDefault();
    document.getElementById('select-target');
    const skus = this.props.selectedStyle.skus;
    let quantity = this.state.selectedQuantity;
    let sku;
    for (let key in skus) {
      if (skus[key].size === this.state.selectedSize) {
        sku = key;
      }
    }
    let promises = [];
    while (quantity > 0) {
      promises.push(this.addToCart(sku));
      quantity--;
    }
    Promise.all(promises)
      .then((res) => {
        console.log('Success posting cart to API');
      })
      .catch((err) => {
        console.log('Error posting cart to API', err);
      });
  }

  addToCart(sku, quantity) {
    return axios.post('/cart', {'sku_id': sku});
  }

  render() {
    return (
      <div id='cart'>
        <form id='cart-form' onSubmit={this.cartHandler.bind(this)}>
          <div data-testid='select-size' id='select-size'>
            <select id='select-target' required onChange={this.setSizeSelection.bind(this)} >
              <option id='size' value="">{this.state.size}</option>
              {
                this.state.availableSizes.map((size, i) => {
                  return <Option key={i} type={'size'} option={size}/>;
                })
              }
            </select>
          </div>
          <div data-testid='select-quantity' id='select-quantity'>
            <select onChange={this.setQuantitySelection.bind(this)}>
              <option id='quantity'>-</option>
              {
                this.state.availableQuantities.map((qty) => {
                  if (qty !== 1) {
                    return <Option key={qty} type={'quantity'} option={qty}/>;
                  }
                })
              }
            </select>
          </div>
          {
            this.state.size !== 'OUT OF STOCK' &&
            <div id='add-to-bag'>
              <button id='bag-button'>ADD TO BAG</button>
              <span> + </span>
            </div>
          }
          <div id='add-to-myoutfit'>
            {
              this.props.currentProductInOutfit === false ?
                <span onClick={this.handleAddToMyOutfit.bind(this)}><IoIosStarOutline id='outfit-star-outline'/></span> :
                <span onClick={this.handleAddToMyOutfit.bind(this)}><IoIosStar id='outfit-star'/></span>
            }
          </div>
        </form>
      </div>
    );
  }
}

export default Cart;

