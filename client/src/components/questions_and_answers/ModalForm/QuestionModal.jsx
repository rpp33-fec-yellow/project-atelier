import React from 'react';
import {IoIosCloseCircleOutline} from 'react-icons/io';

const QuestionModal = (props) => {
  if (props.showQuestionModal === false) {
    return null;
  }
  return (
    <div id='new-question-modal'>
      <div id='new-question-content'>
        <h2 className='QA-form-head'>Ask Your Question</h2>
        <button className='QA-close-btn' onClick={props.clickAddQuestion}><IoIosCloseCircleOutline/></button>
        <h3>About the {props.productName}</h3>

        <form id='submit-question-form' onSubmit={props.submitQuestion}>
          <p className='QA-note'>* mandatory area</p>
          <p>Your Question?*</p>
          <textarea id='your-question' rows='5' cols='50' maxLength='1000' required></textarea>
          <p>What is your nickname?*</p>
          <input id='question-nickname' type='text' size='61' placeholder='Example: jackson11!' maxLength='60' required></input>
          <p className='QA-note'>For privacy reasons, do not use your full name or email address</p>
          <p>Your email?*</p>
          <input id='question-email' type='email' size='61'
            placeholder='Why did you like the product or not?' maxLength='60' required></input>
          <p className='QA-note'>For authentication reasons, you will not be emailed</p>
          <button className='QA-submit-btn' type='submit'>Submit Question</button>
        </form>

      </div>
    </div>
  );
};

export default QuestionModal;