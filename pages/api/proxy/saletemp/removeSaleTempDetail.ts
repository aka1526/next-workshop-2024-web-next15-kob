
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { saleTempDetailId } = req.body;
        const payload = {
            saleTempDetailId: saleTempDetailId
        }
        const response = await axios.delete(`${process.env.API_SERVER_URL}/api/saletemp/removeSaleTempDetail`, { data: payload });
        res.status(200).json(response.data  );
    } catch (error: any) {
        res.status(error.response?.status || 500).json( {error : error.message});
    }
}
