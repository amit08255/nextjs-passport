import React from 'react';

const indexPage = () => {

    return (
        <div>Hello world</div>
    );
}

// This gets called on every request
export async function getServerSideProps(context) {
    
    console.log(context.req);
  
    // Pass data to the page via props
    return { props: { "name": "amit" } }
  }

export default indexPage;