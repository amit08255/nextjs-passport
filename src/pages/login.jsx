import React from 'react';

const indexPage = () => {

    return (
        <form action="/api/login" method="POST">
            <input name="username"/>
            <input name="password"/>
            <button type="submit">Login</button>
        </form>
    );
}

// This gets called on every request
export async function getServerSideProps(context) {
  
    // Pass data to the page via props
    return { props: { "name": "amit" } }
  }

export default indexPage;