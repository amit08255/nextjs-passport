import React from 'react';
import {checkSessionStatus} from '../page-utils';

const indexPage = () => {

    return (
        <div>Homepage</div>
    );
}

export const getServerSideProps = async function({ req, res }) {

    const user = await checkSessionStatus(req, res);

    console.log("\n\nuser: ", user);
  
    return {
      props: { user: null },
    }
}

export default indexPage;