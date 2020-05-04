import React from 'react';
import axios from 'axios';

const indexPage = () => {

    return (
        <div>Homepage</div>
    );
}

export const getServerSideProps = async function({ req, res }) {

    // Fetch data from external API
    const response = await axios.post(`http://localhost:3000/api/verify-session`, {}, {
        headers: {
            Cookie: req.headers.cookie || ""
        }
    });

    const data = response.data;

    if (data.status !== true) {
      res.setHeader('location', '/login');
      res.statusCode = 302;
      res.end();
      return { props: {} };
    }
  
    return {
      props: { user: null },
    }
}

export default indexPage;