import { useState, useEffect } from 'react';
import axios from 'axios';

const fetchTempleData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/results');
        const responseData = response.data;
        setData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default fetchTempleData;