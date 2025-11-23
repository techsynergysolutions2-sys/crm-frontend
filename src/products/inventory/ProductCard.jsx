// src/components/ProductCard.js
import React,{useState, useEffect,useMemo} from 'react';
import {useNavigate } from 'react-router-dom'
import {fnUpateData,fnGetDirectData} from '../../shared/shared'
import {notification } from 'antd';
import './inventory.css';

const Context = React.createContext({ name: 'Default' });

const ProductCard = ({ product,loaddata }) => {

  const navigate = useNavigate()
  const [isactive, setIsactive] = useState('product_active')
  const [activeText, setActiveText] = useState('Active')
  const [fileList, setFileList] = useState([])
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if(product.isactive == 1){
      setIsactive('product_active')
      setActiveText('Active')
    }else{
      setIsactive('product_notactive')
      setActiveText('Not Active')
    }
    fetchData()
  },[product])

  const fetchData = async () => {
      let sql = `
                  SELECT a.uid,a.name,a.status,a.url FROM attachments a 
                  WHERE a.pageid = 2 AND a.recordid = ${product.id} AND a.isactive = 1`
      try {
      const data = await fnGetDirectData('attachments',sql);
      setFileList(data);
      } catch (error) {
      
      }
  
  };

  const getStockStatus = (stock) => {
    if (stock > 10) return { class: 'in-stock', text: 'In Stock' };
    if (stock > 0) return { class: 'low-stock', text: 'Low Stock' };
    return { class: 'out-of-stock', text: 'Out of Stock' };
  };

  const stockStatus = getStockStatus(product.stock);

  const fnNavProduct = (record) => {
        navigate('/product',{
            state: record
        })
  }

  const onDelete = async (record) => {

    if(product.total_orders != 0){
      let placement = 'topRight'
      api.warning({
        title: ``,
        description: 'Product can not be deleted. There is an order linked to this product.',
        placement,duration: 2,
        style: {
          background: "#e2e2e2ff"
        },
      });
      return
    }
    try {
      let values = {
        isactive: 0
      }
        const data = await fnUpateData('products',"products", values,'id = ? AND isactive = ?',[record,1], 'update');
        loaddata()
    } catch (error) {
        console.log(error)
    }
  }

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
    <div className="product-card">
      <div className="product-image">
        <img src={fileList[0]?.url} alt={fileList[0]?.name} />
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className={`product-stock ${isactive}`}>
          {activeText}
        </div>
        <div className="product-meta">
          <div className="product-price">${product.price}</div>
          <div className={`product-stock ${stockStatus.class}`}>
            In stock {product.instock}
          </div>
        </div>
      </div>
      <div className="product-actions">
        <div className="product-action" onClick={() => fnNavProduct(product)}>
          <i className="fas fa-edit"></i> Edit
        </div>
        <div className="product-action" onClick={() => onDelete(product.id)}>
          <i className="fas fa-trash"></i> Delete
        </div>
      </div>
    </div>
    </Context.Provider>
  );
};

export default ProductCard;