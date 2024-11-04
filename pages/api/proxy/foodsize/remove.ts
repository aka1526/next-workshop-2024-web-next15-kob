
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.body;
        const response = await axios.delete(`${process.env.API_SERVER_URL}/api/foodsize/remove/${id}`);
        res.status(200).json(response.data  );
    } catch (error: any) {
        res.status(error.response?.status || 500).json( {error : error.message});
    }
}
