import React from 'react';
import Answer from './Answer.jsx';

const AnswerList = (props) => {
  let answerBySeller = [];
  let answerByOther = [];
  props.answers.forEach((answer) => {
    return answer.answerer_name === 'Seller' ? answerBySeller.push(answer) : answerByOther.push(answer);
  });

  let sortedAnswersByOther = answerByOther.sort(sortByHelpfulness);
  let displayList = answerBySeller.concat(sortedAnswersByOther).slice(0, props.answerNumbers);

  return (
    <div className='answer-list'>
      <div className='answer-title'> A: </div>
      <div className='answer-box' data-testid='alist'>
        {displayList.map((answer) => (
          <Answer answer={answer} key={answer.id}/>
        ))}
      </div>
    </div>
  );
};

export default AnswerList;

const sortByHelpfulness = (a, b) => {
  return b.helpfulness - a.helpfulness;
};