import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime.js';
import axios from 'axios';
jest.mock('axios');

import {exampleQuestions} from './exampleData.js';
import QuestionsAndAnswers from '../q&a.jsx';
import SearchBar from '../SearchBar.jsx';
import QuestionList from '../QuestionList.jsx';
import Question from '../Question.jsx';
import AnswerList from '../AnswerList.jsx';
import Answer from '../Answer.jsx';
import AnswerPhoto from '../AnswerPhoto.jsx';
import QuestionModal from '../ModalForm/QuestionModal.jsx';
import AnswerModal from '../ModalForm/AnswerModal.jsx';

import httpAdapter from 'axios/lib/adapters/http';
axios.defaults.adapter = httpAdapter;
const { API_URL, API_KEY } = require('../../../../../server/config.js');
axios.defaults.baseURL = API_URL;
axios.defaults.headers['Authorization'] = API_KEY;
/**
 * Render tests
 */
describe('Q&A render tests', () => {
  let props = {};
  beforeEach(() => {
    props = {
      product: exampleQuestions.product,
      questions: exampleQuestions.results
    };
  });
  afterEach(cleanup);

  test('render Q&A main page', () => {
    axios.mockResolvedValueOnce({data: {data: {results: props.questions}}});
    render(<QuestionsAndAnswers {...props}/>);
    const container = document.querySelector('#QA-container');
    const btn = screen.getByText('ADD A QUESTION');
    expect(container).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
  });

  test('render searchBar component', () => {
    const {queryByPlaceholderText} = render(<SearchBar/>);
    const searchInput = queryByPlaceholderText('HAVE A QUESTION? SEARCH FOR ANSWERS...');
    expect(searchInput).toBeInTheDocument();
  });

  test('render QuestionList component', () => {
    const {rerender} = render(<QuestionList questions={props.questions} questionNumbers={2}/>);
    const list = screen.getByTestId('qlist');
    expect(list.children.length).toEqual(2);

    rerender(<QuestionList questions={props.questions} questionNumbers={4}/>);
    const newlist = screen.getByTestId('qlist');
    expect(newlist.children.length).toEqual(4);
  });

  test('render Question component', () => {
    render(<Question question={props.questions[1]}/>);
    const container = document.querySelector('.each-question');
    const btn = screen.getAllByText('Add Answer')[0];
    expect(container).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
  });

  test('render AnswerList component', () => {
    const answerArray = Object.values(props.questions[0].answers);
    const {rerender} = render(<AnswerList answers={answerArray} answerNumbers={2}/>);
    const list = screen.getByRole('alist');
    expect(list.children.length).toEqual(2);

    rerender(<AnswerList answers={answerArray} answerNumbers={4}/>);
    const newList = screen.getByRole('alist');
    expect(newList.children.length).toEqual(4);
  });

  test('render Answer component', () => {
    const answerArray = Object.values(props.questions[1].answers);
    render(<Answer answer={answerArray[0]}/>);
    const container = document.querySelector('.each-answer');
    const helpfulBtn = screen.getAllByTestId('answer-help')[0];
    const reportBtn = screen.getAllByText('Report')[0];
    expect(container).toBeInTheDocument();
    expect(helpfulBtn).toBeInTheDocument();
  });

  test('render Answer photo form component', () => {
    const photo = 'https://i.ibb.co/xXxgndP/30bfbeec39a9.jpg';
    render(<AnswerPhoto photo={photo}/>);

    const image = document.querySelector('img');
    expect(image.src).toBe(photo);
  });

  test('render Question modal component', () => {
    render(<QuestionModal productName={props.productName}/>);
    const formContent = document.querySelector('#new-question-content');
    expect(formContent).toBeInTheDocument();
  });

  test('render Anwer modal form component', () => {
    render(<AnswerModal productName={props.productName} question={props.questions[1]}/>);
    const formContent = document.querySelector('#new-answer-content');
    expect(formContent).toBeInTheDocument();
  });
});

/**
 * more widget feature tests
 */

describe('Test on search bar component', () => {
  let props = {};
  test('test on searchBar component', () => {
    props = {
      product: exampleQuestions.product,
      questions: exampleQuestions.results
    };
    jest.clearAllMocks();
    axios.mockResolvedValueOnce({data: {data: {results: props.questions}}});
    const {queryByPlaceholderText} = render(<QuestionsAndAnswers {...props}/>);
    const searchInput = queryByPlaceholderText('HAVE A QUESTION? SEARCH FOR ANSWERS...');
    fireEvent.change(searchInput, { target: { value: 'test'} });
    expect(searchInput.value).toBe('test');
  });
});

describe('Test on Question Features', () => {
  let props = {};
  beforeEach(() => {
    props = {
      product: exampleQuestions.product,
      questions: exampleQuestions.results
    };
    jest.clearAllMocks();
  });
  afterEach(cleanup);

  test('test on Question component', () => {
    jest.clearAllMocks();
    axios.mockResolvedValueOnce({status: 204});

    const {rerender} = render(<Question question={props.questions[1]}/>);
    const helpfulBtn = screen.getByTestId('question-help');

    expect(helpfulBtn).not.toBeDisabled();
    fireEvent.click(helpfulBtn);
    // expect(helpfulBtn).toBeDisabled();
  });

});

describe('Test on Answer Features', () => {
  let props = {};
  beforeEach(() => {
    props = {
      product: exampleQuestions.product,
      questions: exampleQuestions.results
    };
    jest.clearAllMocks();
  });
  afterEach(cleanup);

  test('test on click more answers', () => {
    const answerArray = Object.values(props.questions[1].answers);

    const {rerender} = render(<Question question={props.questions[1]}/>);
    const list = screen.getByTestId('alist');
    expect(list.children.length).toEqual(2);

    const moreBtn = screen.getByText('LOAD MORE ANSWERS');
    fireEvent.click(moreBtn);

    rerender(<Question question={props.questions[1]}/>);
    const collapseBtn = screen.getByText('COLLAPSE ANSWERS');
    expect(collapseBtn).toBeInTheDocument();

    const newlist = screen.getByTestId('alist');
    expect(newlist.children.length).toEqual(answerArray.length);
  });

  test('test answer marking helpful', () => {
    const answerArray = Object.values(props.questions[1].answers);

    jest.clearAllMocks();
    axios.mockResolvedValueOnce({status: 204});

    const {rerender} = render(<Answer answer={answerArray[1]}/>);
    const helpfulBtn = screen.getByTestId('answer-help');

    expect(helpfulBtn).not.toBeDisabled();
    fireEvent.click(helpfulBtn);
    // expect(helpfulBtn).toBeDisabled();
  });

  test('test answer report', () => {
    const answerArray = Object.values(props.questions[1].answers);

    jest.clearAllMocks();
    axios.mockResolvedValueOnce({status: 204});

    const {rerender} = render(<Answer answer={answerArray[1]}/>);
    const reportBtn = screen.getByTestId('report');

    expect(reportBtn).not.toBeDisabled();
    fireEvent.click(reportBtn);
  // expect(reportBtn).toBeDisabled();
  });

});

describe('Test on Modal Form Features', () => {
  let props = {};
  beforeEach(() => {
    props = {
      product: exampleQuestions.product,
      questions: exampleQuestions.results
    };
    jest.clearAllMocks();
    axios.mockResolvedValueOnce({data: {data: {results: props.questions}}});
  });
  afterEach(() => {
    cleanup;
    jest.clearAllMocks();
  });

  test('Test on click add question', () => {
    render(<QuestionsAndAnswers {...props}/>);
    const btn = screen.getByText('ADD A QUESTION');
    fireEvent.click(btn);
    const form = document.querySelector('#new-question-modal');
    expect(form).toBeInTheDocument();
  });

  test('Test on question modal', () => {
    const testData = {body: 'Can I wash it', nickname: 'tobi', email: 'tobi@email.com'};

    render(<QuestionModal productName={props.productName}/>);
    const testBody = document.querySelector('#your-question');
    const testNickname = document.querySelector('#question-nickname');
    const testEmail = document.querySelector('#question-email');

    fireEvent.change(testBody, { target: { value: testData.body} });
    fireEvent.change(testNickname, { target: { value: testData.nickname} });
    fireEvent.change(testEmail, { target: { value: testData.email} });

    expect(testBody.value).toBe(testData.body);
    expect(testNickname.value).toBe(testData.nickname);
    expect(testEmail.value).toBe(testData.email);
  });

  test('Test on submit add question', () => {
    const testData = {body: 'Can I wash it', nickname: 'tobi', email: 'tobi@email.com'};

    render(<QuestionsAndAnswers {...props}/>);

    const btn = screen.getByText('ADD A QUESTION');
    fireEvent.click(btn);

    jest.clearAllMocks();
    axios.mockResolvedValueOnce({status: 201});

    const formInput = document.querySelector('#submit-question-form');
    fireEvent.submit(formInput, {target: [{value: testData.body}, {value: testData.nickname}, {value: testData.email}]});

    const form = document.querySelector('#new-answer-modal');
    expect(form).not.toBeInTheDocument();
  });

  test('Test on click add answer', () => {
    render(<Question question={props.questions[1]}/>);
    const btn = screen.getByText('Add Answer');
    fireEvent.click(btn);
    const form = document.querySelector('#new-answer-modal');
    expect(form).toBeInTheDocument();
  });

  test('Test on answer modal', () => {
    const testData = {body: 'Not sure', nickname: 'tobi', email: 'tobi@email.com', photo: 'https://i.ibb.co/xXxgndP/30bfbeec39a9.jpg'};

    jest.clearAllMocks();
    axios.mockResolvedValueOnce({data: {data: {url: testData.photo}}});

    render(<AnswerModal productName={props.productName} question={props.questions[1]}/>);
    const testBody = document.querySelector('#answer-body');
    const testNickname = document.querySelector('#answer-nickname');
    const testEmail = document.querySelector('#answer-email');
    const uploadBtn = document.querySelector('#upload-answer-photo');

    fireEvent.change(testBody, { target: { value: testData.body} });
    fireEvent.change(testNickname, { target: { value: testData.nickname} });
    fireEvent.change(testEmail, { target: { value: testData.email} });
    fireEvent.change(uploadBtn, 'file1.jpg');

    expect(testBody.value).toBe(testData.body);
    expect(testNickname.value).toBe(testData.nickname);
    expect(testEmail.value).toBe(testData.email);
  });

  test('Test on submit add answer', () => {
    const testData = {body: 'Not sure', nickname: 'tobi', email: 'tobi@email.com', images: []};

    jest.clearAllMocks();
    axios.mockResolvedValueOnce({status: 201});

    render(<Question question={props.questions[1]}/>);
    const addBtn = screen.getByText('Add Answer');
    fireEvent.click(addBtn);

    const formInput = document.querySelector('#submit-answer-form');
    fireEvent.submit(formInput, {target: [{value: testData.body}, {value: testData.nickname}, {value: testData.email}]});

    const closeBtn = document.querySelector('.QA-close-btn');
    fireEvent.click(closeBtn);
    const form = document.querySelector('#new-answer-modal');
    expect(form).not.toBeInTheDocument();
  });
});

/**
 * Error boundary tests
 */

describe('Test on errors', () => {

});