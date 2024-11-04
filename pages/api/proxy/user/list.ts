// pages/api/proxy/user/list.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
require('dotenv').config();
const API_URL =process.env.API_SERVER_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // เรียก API จริงโดยใช้ URL ที่ซ่อนอยู่
        const response = await axios.get(`${API_URL}/api/user/list`);
        // ส่งข้อมูลที่ได้จาก API กลับไปยัง Client
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
}
