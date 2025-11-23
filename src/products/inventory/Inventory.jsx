// src/pages/AllProducts.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Input,Button } from 'antd';
import {useNavigate } from 'react-router-dom'
import {fnGetDirectData} from '../../shared/shared'
import './inventory.css';

const Inventory = () => {

    const navigate = useNavigate()

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([])

    useEffect(() => {
        
        fnFetchData();
    }, []);

    const fnFetchData = async () => {
        var companyid = sessionStorage.getItem('companyid')
        var uid = sessionStorage.getItem('uid')
        let sql = `
            SELECT p.*, COALESCE(COUNT(DISTINCT op.orderid), 0) AS total_orders
            FROM products p
            LEFT JOIN order_products op ON op.productid = p.id AND op.isactive = 1
            LEFT JOIN orders o ON o.id = op.orderid AND o.isactive = 1 
            WHERE p.companyid = ${companyid} AND op.isactive = 1
            `
        
        try {
        const data = await fnGetDirectData('products',sql);
        setProducts(data);
        setFilteredProducts(data)
        // setLoading(!loading)
        } catch (error) {
        console.log(error)
        }
    };

    const fnNavProduct = (record) => {
        navigate('/product',{
            state: record
        })
    }

  const handleEdit = (product) => {
    navigate('/product',{
        state: product
    })
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  const fnHandleSearch = (e) => {

    setFilteredProducts(products.filter(p => p.title.toLowerCase().includes(e.toLowerCase())))
  }

  return (
    <div className="all-products-page" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
      <div className="container">
        <h1 className="page-title">All Products</h1>
        
        <div className="products-header">
          <h2>Products ({filteredProducts.length})</h2>
          <div className="inventory">
            <Input.Search placeholder="search" onChange={(e) => fnHandleSearch(e.target.value)} size="large"/>
          </div>
          {/* <Link className="btn btn-primary" onClick={() => fnNavProduct({})}>
            <i className="fas fa-plus"></i> Add Product
          </Link> */}
          <Button type="primary" onClick={() => fnNavProduct({})} size="large">Add Product</Button>
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loaddata={fnFetchData}
              />
            ))
          ) : (
            <div className="no-products">
              <i className="fas fa-box-open"></i>
              <h3>No products found</h3>
              <p>Add product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;