import axios from 'axios';

export const checkSessionStatus = async (req, res) => {

    const PORT = process.env.PORT || 3000;
    const baseURL = `http://localhost:${PORT}`;

    // Fetch data from external API
    const response = await axios.post(`${baseURL}/api/get-user`, {}, {
        headers: {
            Cookie: req.headers.cookie || ""
        }
    });

    const data = response.data;

    if (data.status !== true) {
      res.setHeader('location', '/login');
      res.statusCode = 302;
      res.end();
      return;
    }

    return data.user;
}