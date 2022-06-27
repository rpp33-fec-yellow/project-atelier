import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { product, styles } from '../sampleData/sampleData.js';
import ProductOverview from './product_overview/overview.jsx';
import RelatedItemsOutfitCreation from './related_items_outfit_creation/related_items&outfit.jsx';
import QuestionsAndAnswers from './questions_and_answers/q&a.jsx';
import RatingsAndReviews from './ratings_and_reviews/ratings&reviews.jsx';
import RelatedItemsAndMyOutfits from './related_items_outfit_creation/related_items&outfit.jsx';
import AddInteractionsLogger from './interactions.jsx';
import StarRating from './starRating.jsx';
const ProductOverviewWithLogger = AddInteractionsLogger(ProductOverview);
const RelatedItemsOutfitCreationWithLogger = AddInteractionsLogger(RelatedItemsOutfitCreation);
const QuestionsAndAnswersWithLogger = AddInteractionsLogger(QuestionsAndAnswers);
const RatingsAndReviewsWithLogger = AddInteractionsLogger(RatingsAndReviews);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productIsFetched: false,
      stylesAreFetched: false,
      product: {},
      styles: {},
      myOutfits: [],
      currentProductInOutfit: false,
      starRating: 0,
      defaultProductId: 71697
    };
  }

  componentDidMount() {
    this.initializeProduct();
  }

  initializeProduct() {
    let productID = this.state.defaultProductId;

    if (window.location.search.length > 1) {
      productID = window.location.search.substring(1);
    }
    window.history.pushState({}, '', productID);
    this.updateProduct(productID);
  }

  updateProduct(id) {
    window.history.pushState({}, '', id);
    Promise.all([this.getProduct(id), this.getStyles(id), this.getOutfits()])
      .then((res) => {
        this.setState({
          product: res[0].data.data,
          productIsFetched: true,
          stylesAreFetched: true,
          styles: res[1].data.data,
          myOutfits: res[2],
          currentProductInOutfit: false
        });
      })
      .then((res) => {
        if (this.state.myOutfits.includes(this.state.product.id.toString())) {
          this.setState({ currentProductInOutfit: true });
        }
      })
      .catch((err) => {
        console.log('Error Retrieving Data from Server', err);
      });
  }

  getProduct(id) {
    return axios({
      method: 'get',
      url: 'products/' + id,
    });
  }

  getStyles(id) {
    return axios({
      method: 'get',
      url: 'products/' + id + '/styles',
    });
  }

  getOutfits() {
    //TODO: Handle if local storage has more than just my outfits in it
    let local = Object.keys(localStorage);
    let localStorageOutfits = local.map((item) => {
      if (item.includes('&*%')) {
        return item.slice(3);
      }
    });
    return localStorageOutfits;
  }

  toggleOutfit(id) {
    const key = '&*%' + id;
    const value = id;
    if (!this.state.currentProductInOutfit) {
      localStorage.setItem(key, value);
      this.setState({ myOutfits: this.getOutfits(), currentProductInOutfit: true }, () => {
        console.log(this.state.myOutfits);
      });
    } else {
      localStorage.removeItem(id, id);
      this.setState({ myOutfits: this.getOutfits(), currentProductInOutfit: false }, () =>{
      });
    }
  }

  updateStarRating(rating) {
    this.setState({ starRating: rating });
  }

  render() {
    if (!this.state.productIsFetched || !this.state.stylesAreFetched) {
      return <div id='loading-img'>
        <img src='https://thumbs.gfycat.com/GeneralUnpleasantApisdorsatalaboriosa-size_restricted.gif'></img>;
      </div>;
    }
    return (
      <React.Fragment>
        <ProductOverviewWithLogger
          currentProductInOutfit={this.state.currentProductInOutfit}
          product={this.state.product}
          styles={this.state.styles}
          starRating={<StarRating value={this.state.starRating}/>}
          toggleOutfit={this.toggleOutfit.bind(this)}/>

        <RelatedItemsOutfitCreationWithLogger
          product={this.state.product}
          myOutfits={this.state.myOutfits}
          starRating={<StarRating value={this.state.starRating}/>}
          toggleOutfit={this.toggleOutfit.bind(this)}
          updateProduct={this.updateProduct.bind(this)} />

        <QuestionsAndAnswersWithLogger product={this.state.product}/>

        <RatingsAndReviewsWithLogger
          starRating={this.state.starRating}
          updateStarRating={this.updateStarRating.bind(this)}
          product={this.state.product}
        />
      </React.Fragment>
    );
  }
}

export default App;

//TODO make all products that are added to local storage start with &*%