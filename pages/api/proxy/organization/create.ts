import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await axios.post(`${process.env.API_SERVER_URL}/api/organization/create`, req.body);
      // console.log('response.data::'+response.data);
       
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
}
