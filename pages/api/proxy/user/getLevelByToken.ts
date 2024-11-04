// pages/api/proxy/user/list.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { authorization } = req.headers;
        const response = await axios.get(`${process.env.API_SERVER_URL}/api/user/getLevelByToken`,  {
            headers :{
                Authorization: authorization || '',
            }
        });
       // co
        // ส่งข้อมูลที่ได้จาก API กลับไปยัง Client
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
}
