import React from 'react';

const indexPage = () => {

    return (
        <div>Homepage</div>
    );
}

export const getServerSideProps = async function({ req, res }) {

    const user = undefined;
  
    if (user === undefined) {
      res.setHeader('location', '/login')
      res.statusCode = 302
      res.end()
      return { props: {} }
    }
  
    return {
      props: { user: null },
    }
}

export default indexPage;