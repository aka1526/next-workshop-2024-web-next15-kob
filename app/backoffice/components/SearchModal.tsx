"use client"; // ใช้ใน client component

import { useEffect, useState } from 'react';
import { ReactNode } from "react";
import config from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";

interface ModalProps {
    id: string;
    title: string;
    modalSize?: string;
    setSelectedProduct?: (product: any) => void; 
    show: boolean; 
    handleClose: () => void; 
    children: ReactNode;
}

const SearchModal: React.FC<ModalProps> = ({ show, handleClose, setSelectedProduct }) => {
    const [products, setProducts] = useState<any[]>([]); // เก็บรายการสินค้า
    const [visibleProducts, setVisibleProducts] = useState<any[]>([]); // รายการสินค้าที่แสดง
    const [searchTerm, setSearchTerm] = useState<string>(''); // ค่าของ input ค้นหา
    const [page, setPage] = useState<number>(1); // หมายเลขหน้า
    const itemsPerPage = 10; // จำนวนรายการต่อหน้า

    const filterFoods = async (foodType: string) => {
        try {
            const res = await axios.get(`${config.apiServer}/api/food/search/${foodType}`);
            setProducts(res.data.results);
        } catch (e: any) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error'
            });
        }
    }

    useEffect(() => {
        if (show) {
            filterFoods('all');
            setPage(1); // รีเซ็ตหมายเลขหน้าเมื่อเปิด Modal
            setSearchTerm(''); // รีเซ็ตค่าค้นหาเมื่อเปิด Modal
        } else {
            setProducts([]); // ล้างข้อมูลเมื่อปิด Modal
            setVisibleProducts([]); // ล้างข้อมูลที่แสดง
        }
    }, [show]);

    useEffect(() => {
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setVisibleProducts(filteredProducts.slice(startIndex, endIndex)); // กำหนดสินค้าให้แสดงตามหน้า
    }, [page, products, searchTerm]);

    const handleSelectProduct = (product: any) => {
        if (setSelectedProduct) {
            setSelectedProduct(product); // Set the selected product
            handleClose(); // Close the modal
        }
    };

    const totalPages = Math.ceil(products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / itemsPerPage); // คำนวณจำนวนหน้าทั้งหมด

    return (
        <div
            className={`modal fade ${show ? 'show d-block' : 'd-none'}`}
            tabIndex={-1}
            role="dialog"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                     
                    <div className="modal-body">
                        <input 
                            type="text" 
                            style={{ 
                              backgroundColor: "rgb(207, 209, 210)", 
                              border: "1px solid #ccc", // เพิ่มเส้นขอบ
                              padding: "10px", // เพิ่ม padding
                              borderRadius: "4px", // เพิ่มมุมมน
                              fontSize: "16px" // ขนาดฟอนต์
                          }} 
                            className="form-control mb-3  t" 
                            placeholder="ค้นหาสินค้า..."
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value); // อัพเดตค่าของ searchTerm
                              setPage(1); // รีเซ็ตหมายเลขหน้าเป็น 1 เมื่อมีการค้นหา
                          }} 
                        />
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ชื่อสินค้า</th>
                                    <th className='text-right' style={{ width : "180px" }}>ราคา</th>
                                    <th style={{ width : "80px" }}>เลือก</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleProducts.map((product) => (
                                  
                                    <tr key={product.id}>
                                    
                                        <td>{product.name}</td>
                                        <td className='text-right'>{product.price} บาท</td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleSelectProduct(product)}
                                            >
                                                เลือก
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* ปุ่มเปลี่ยนหน้า */}
                        <div className="pagination">
                            <button 
                                className="btn btn-primary" 
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1} // ปิดใช้งานถ้าหน้าแรก
                            >
                                &laquo; ก่อนหน้า
                            </button>
                            <span className="mx-2">หน้า {page} จาก {totalPages}</span>
                            <button 
                                className="btn btn-primary" 
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages} // ปิดใช้งานถ้าหน้าสุดท้าย
                            >
                                ถัดไป &raquo;
                            </button>
                            <button className="btn btn-danger ml-3" onClick={handleClose}>
                            <i className="fa fa-times" aria-hidden="true"></i> ปิดหน้าต่าง
                        </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default SearchModal;
