'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/app/config'; // ไฟล์ config สำหรับเก็บ URL และ Token
import Swal from 'sweetalert2';
import { totalmem } from 'os';

export default function FoodPaginate() {
  const [foods, setFoods] = useState<any[]>([]);
  const [totalItems,setTotalItems] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // ค่าเริ่มต้น: 10 รายการต่อหน้า

  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]); // โหลดใหม่เมื่อ currentPage หรือ itemsPerPage เปลี่ยน

  const fetchData = async (page: number, items: number) => {
    try {
      
      const token = localStorage.getItem(config.token??'token' );
      const payload = { page, itemsPerPage: items };
      const res = await axios.post(`/api/proxy/food/paginate`, payload, {
              headers :{
                  Authorization: `Bearer ${token}`,
              }
          });


      setFoods(res.data.results);
      setTotalPage(res.data.totalPage);
      setTotalItems(res.data.totalItems);
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPage) {
      setCurrentPage(page); // อัปเดตหน้าปัจจุบัน
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value)); // อัปเดตจำนวนรายการต่อหน้า
    setCurrentPage(1); // รีเซ็ตไปหน้าแรก
  };
  const formattedPrice = (price:any) => {
    return parseFloat(price).toFixed(2) +' บาท'; // Ensures two decimal places
  };
  const getItemIndex = (index: number) => (currentPage - 1) * itemsPerPage + index + 1;
  return (
    <div className="card mt-3">
      <div className="card-header bg-primary">รายการอาหาร  <span  > (จำนวน : {totalItems} รายการ) </span>
      </div>
      <div className="card-body">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr >
              <th className=' text-white text-center' style={{ 'width':'100px' }}>รายการ</th>
              <th className=' text-white text-center' style={{ 'width':'150px' }}>รูป</th>
              <th className=' text-white'>ชื่ออาหาร</th>
              <th className=" text-white text-end" style={{ width: '120px' }}>ราคา</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food,index) => (
              <tr key={food.id}>
                 <td className='text-center'>{getItemIndex(index)}</td>
                 <td  align="center"> 
                    <img  src={config.apiServer + '/uploads/' + food.img} alt={food.name}  style={{ 'height':'100px'}} /> 
                 </td>
                
                <td>{food.name}</td>
                <td className="text-end">{formattedPrice(food.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Move the items per page dropdown and pagination below the table */}
        <div className="d-flex justify-content-between align-items-center mt-3">
         
          <div >
            <label className="me-2">จำนวนต่อหน้า:</label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              {[5, 10, 15, 20, 25 , 50, 100, 200].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select> 
           
          </div>

          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            changePage={changePage}
          />
        </div>
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  changePage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPage, changePage }) => {
  const generatePages = () => {
    const pages: (number | string)[] = [];
    const pageRange = 2;

    for (let i = 1; i <= Math.min(3, totalPage); i++) {
      pages.push(i);
    }

    if (currentPage > pageRange + 3) pages.push('...');

    for (
      let i = Math.max(4, currentPage - pageRange);
      i <= Math.min(totalPage - 3, currentPage + pageRange);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPage - pageRange - 2) pages.push('...');

    for (let i = Math.max(totalPage - 2, 4); i <= totalPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="mt-2">
      <button
        disabled={currentPage === 1}
        className="btn btn-primary me-1"
        onClick={() => changePage(1)}
      >
        <i className="fa fa-chevron-left me-2"></i> หน้าแรก
      </button>

      <button
        disabled={currentPage === 1}
        className="btn btn-primary me-1"
        onClick={() => changePage(currentPage - 1)}
      >
        <i className="fa fa-chevron-left"></i>
      </button>

      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            className={`btn btn-primary me-1 ${currentPage === page ? 'active' : ''}`}
            onClick={() => changePage(page)}
            disabled={currentPage === page}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="mx-1">...</span>
        )
      )}

      <button
        disabled={currentPage === totalPage}
        className="btn btn-primary me-1"
        onClick={() => changePage(currentPage + 1)}
      >
        <i className="fa fa-chevron-right"></i>
      </button>

      <button
        disabled={currentPage === totalPage}
        className="btn btn-primary"
        onClick={() => changePage(totalPage)}
      >
        <i className="fa fa-chevron-right me-2"></i> หน้าสุดท้าย
      </button>
    </div>
  );
};
