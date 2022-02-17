import React from 'react';

const StarList = (props) => {

  const onStarClick = (event) => {
    props.updateFilter(event.target.id);
  };

  let ratings = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

  if (props.metaData.data) {
    ratings = props.metaData.data.ratings;
  }

  return (
    <div id='ratings-breakdown-starlist'>
      <span onClick={onStarClick} id='1'>1 Star: {ratings[1]} reviews</span><br></br>
      <span onClick={onStarClick} id='2'>2 Star: {ratings[2]} reviews</span><br></br>
      <span onClick={onStarClick} id='3'>3 Star: {ratings[3]} reviews</span><br></br>
      <span onClick={onStarClick} id='4'>4 Star: {ratings[4]} reviews</span><br></br>
      <span onClick={onStarClick} id='5'>5 Star: {ratings[5]} reviews</span><br></br>
    </div>
  );
};

export default StarList;