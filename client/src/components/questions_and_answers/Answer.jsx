import React from 'react';
import axios from 'axios';
import AnswerPhoto from './AnswerPhoto.jsx';
import {IoIosCloseCircleOutline} from 'react-icons/io';

class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AnswerHelpful: false,
      reported: false,
      showPhotoModal: false,
      expandImageURL: ''
    };

    this.renderAnswererName = this.renderAnswererName.bind(this);
    this.renderAnswerHelpfulBtn = this.renderAnswerHelpfulBtn.bind(this);
    this.markAnswerHelpful = this.markAnswerHelpful.bind(this);
    this.renderReportBtn = this.renderReportBtn.bind(this);
    this.reportAnswer = this.reportAnswer.bind(this);
    this.answerPhotoClick = this.answerPhotoClick.bind(this);
    this.renderPhotoModal = this.renderPhotoModal.bind(this);
  }

  renderAnswererName() {
    if (this.props.answer.answerer_name === 'Seller') {
      return ( <b>{this.props.answer.answerer_name}</b> );
    } else {
      return ( <span>{this.props.answer.answerer_name}</span> );
    }
  }

  renderAnswerHelpfulBtn() {
    if (this.state.AnswerHelpful) {
      return ( <button className='answer-helpful' data-testid='answer-help' disabled > Yes ({this.props.answer.helpfulness + 1}) </button> );
    } else {
      return ( <button className='answer-helpful' data-testid='answer-help' onClick={this.markAnswerHelpful}> Yes ({this.props.answer.helpfulness}) </button> );
    }
  }

  markAnswerHelpful() {
    axios({
      method: 'put',
      url: `/qa/answers/${this.props.answer.id}/helpful`,
      params: {'answer_id': this.props.answer.id}
    }).then(()=> {
      this.setState({ AnswerHelpful: true });
    }).catch((err)=> {
      console.log('error marking answer helpful', err);
    });
  }

  renderReportBtn() {
    if (this.state.reported) {
      return ( <button className='answer-report' data-testid="report" disabled> Reported </button> );
    } else {
      return ( <button className='answer-report' data-testid="report" onClick={this.reportAnswer}> Report </button> );
    }
  }

  reportAnswer() {
    axios({
      method: 'put',
      url: `/qa/answers/${this.props.answer.id}/report`,
      params: {'answer_id': this.props.answer.id}
    }).then(()=> {
      this.setState({ reported: true });
    }).catch((err)=> {
      console.log('error reporting answer', err);
    });
  }

  answerPhotoClick(url) {
    this.setState(prevState => ({showPhotoModal: !prevState.showPhotoModal}));
    this.setState({
      expandImageURL: url
    });
  }

  renderPhotoModal() {
    if (this.state.showPhotoModal) {
      return (
        <div id='answer-photo-modal'>
          <div id='answer-photo-content'>
            <button className='QA-close-btn' onClick={this.answerPhotoClick}><IoIosCloseCircleOutline/></button>
            <img src={this.state.expandImageURL} alt='expandPhoto'/>
          </div>
        </div>
      );
    } else { return null; }
  }

  render() {
    return (
      <div className='each-answer'>
        <div className='answer-body'> {this.props.answer.body} </div>
        <div className='answer-photo-box'>
          {this.props.answer.photos.map((photo, index) => (
            <AnswerPhoto photo={photo} key={index} answerPhotoClick={this.answerPhotoClick} />
          ))}
        </div>
        {this.renderPhotoModal()}
        <div className='answer-interaction'>
          by {this.renderAnswererName()}, {renderDate(this.props.answer.date.toString())} | Helpful?
          {this.renderAnswerHelpfulBtn()} | {this.renderReportBtn()}
        </div>
      </div>
    );
  }
}

export default Answer;

const renderDate = (string) => {
  const date = new Date(string);
  const render = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(date);
  return render;
};