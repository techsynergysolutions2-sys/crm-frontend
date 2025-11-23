import { useState, useEffect } from 'react';
import './invoice.css'; 
import {fnGetDirectData } from '../../shared/shared'
import { useNavigate,useLocation } from 'react-router-dom'

const Invoice = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(location.state)
    const [total, setTotal] = useState(0)
    const [company, setCompany] = useState({})

    useEffect(() => {
        fnGetDataLoad()
    },[])
  
    const fnGoBack = () => {
      navigate('/orders')
    }
  
    const fnGetDataLoad = async () => {
  
      try {
        let sql = `
            SELECT c.* FROM companies c WHERE c.id = ${sessionStorage.getItem('companyid')}
            `
        const data = await fnGetDirectData('products',sql);
  
        setCompany(data[0])
        setTotal( Math.round(order.order_total * 100) / 100)
      } catch (error) {
        // console.log(error)
      }
      
    }
  

  return (
    <div className="invoice-container" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
      <div className="invoice-header">
        <h1>INVOICE</h1>
        <div className="invoice-number">Order Number {order.ordernumber}</div>
      </div>

      <div className="invoice-body">
        <div className="invoice-info">
          <div className="info-section">
            <h3>From</h3>
            <p>
              <strong>{company?.companyname}</strong><br />
              {company?.address}<br />
              Phone: {company?.contactnumber}<br />
              Email: {company?.email}
            </p>
          </div>
          <div className="info-section">
            <h3>Bill To</h3>
            <p>
              <strong>{order.customername}</strong><br />
              {order.deliveryaddress}<br />
              Phone: {order.contactnumber}<br />
              Email: {order.email}
            </p>
          </div>
        </div>

        {/* <div className="invoice-details">
          <div className="detail-item">
            <div className="detail-label">Invoice Date</div>
            <div className="detail-value">{invoiceData.date}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Due Date</div>
            <div className="detail-value">{invoiceData.dueDate}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Payment Terms</div>
            <div className="detail-value">{invoiceData.paymentTerms}</div>
          </div>
        </div> */}

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order?.products.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals">
          <div className="total-row grand-total">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>

        {/* <div className="notes">
          <h4>Payment Instructions</h4>
          <p>
            Please make payment via bank transfer to:<br />
            Bank Name: {invoiceData.paymentInstructions.bankName}<br />
            Account Number: {invoiceData.paymentInstructions.accountNumber}<br />
            Routing Number: {invoiceData.paymentInstructions.routingNumber}
          </p>
        </div> */}

        <div className="invoice-footer">
          <p>Thank you for your business!</p>
          <p style={{ marginTop: '10px', fontSize: '14px' }}>
            If you have any questions about this invoice, please contact us at {company?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;