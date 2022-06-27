import React from 'react';
import axios from 'axios';
import RelatedItems from './related-list.jsx';
import MyOutfits from './outfit-list.jsx';

class RelatedItemsAndMyOutfits extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      relatedItemsData: [],
      myOutfitsData: []
    };
  }

  componentDidMount() {
    this.initializeWithData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.product !== prevProps.product) {
      this.initializeWithData();
    }
  }

  initializeWithData() {
    return this.generateRelatedItemsData()
      .then((res) => {
        this.setState({ relatedItemsData: res });
      })
      .then((res) => {
        return this.generateMyOufitsData();
      })
      .then((res) => {
        this.setState({ myOutfitsData: res });
      })
      .catch((err) => {
        console.log('Error Generating Related Items or Outfits Data', err);
      });
  }

  getRelatedItems() {
    return axios({
      method: 'get',
      url: 'products/' + this.props.product.id + '/related'
    });
  }

  getProductInfo(id) {
    return axios({
      method: 'get',
      url: 'products/' + id
    })
      .then((res) => {
        let item = {};
        item.id = id;
        item.name = res.data.data.name;
        item.category = res.data.data.category;
        return item;
      })
      .catch((err) => {
        console.log('Error Getting Product Info', err);
      });
  }

  getStyleInfo(product) {
    return axios({
      method: 'get',
      url: 'products/' + product.id + '/styles',
    })
      .then((res) => {
        let results = res.data.data.results[0];
        product.sale = results.sale_price;
        product.price = results.original_price;
        product.image = results.photos[0].thumbnail_url;
        return product;
      })
      .catch((err) => {
        console.log('Error Getting Style Info', err);
      });
    return product;
  }

  addProductInfo(ids) {
    let relatedItemsPromises = ids.map((id) => {
      let productInfoAdded = this.getProductInfo(id);
      return productInfoAdded;
    });
    return Promise.all(relatedItemsPromises);
  }

  addStyleInfo(products) {
    let relatedItemsPromises = products.map((product) => {
      let styleInfoAdded = this.getStyleInfo(product);
      return styleInfoAdded;
    });
    return Promise.all(relatedItemsPromises);
  }

  generateRelatedItemsData() {
    return this.getRelatedItems()
      .then((res) => {
        return this.addProductInfo(res.data.data);
      })
      .then((res) => {
        return this.addStyleInfo(res);
      })
      .catch((err) => {
        console.log('Error Generating Related Items Data', err);
      });
  }

  generateMyOufitsData() {
    return this.addProductInfo(this.props.myOutfits)
      .then((res) => {
        return res;
      })
      .then((res) => {
        return this.addStyleInfo(res);
      })
      .catch((err) => {
        console.log('Error Generating My Outfits Data', err);
      });
  }

  render() {
    return (
      <div id='related-items-and-my-outfits'>
        <span className='widget-title'>RELATED PRODUCTS</span>
        <RelatedItems updateProduct={this.props.updateProduct} toggleOutfit={this.props.toggleOutfit} relatedItems={this.state.relatedItemsData} starRating={this.props.starRating}/>
        <span className='widget-title'>YOUR OUTFIT</span>
        <MyOutfits myOutfits={this.state.myOutfitsData} starRating={this.props.starRating} toggleOutfit={this.props.toggleOutfit}/>
      </div>
    );
  }


}

export default RelatedItemsAndMyOutfits;