import React,{ useState, useEffect,useMemo } from 'react';
import {Button ,Col, Row ,Input,Select,Form,notification } from 'antd';
import './neworder.css';
import {order_status,fnGetDirectData,fnCreateData,fnUpateData } from '../../shared/shared'
import { useNavigate,useLocation } from 'react-router-dom'

const { Option } = Select;
const { TextArea } = Input;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

const CreateOrder = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state)
  const [employees, setEmployees] = useState([])
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState({})
  const [quantity, setQuantity] = useState(0)
  const [total, setTotal] = useState(0)
  const [instock, setInstock] = useState(0)
  const [api, contextHolder] = notification.useNotification();

  var companyid = sessionStorage.getItem('companyid')

  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    fnGetDataLoad()
  },[])

  const fnGoBack = () => {
    navigate('/orders')
  }

  const fnGetDataLoad = async () => {

    try {
      let sql1 = `
                SELECT e.* FROM employees e 
                WHERE e.companyid = ${companyid} AND e.isactive = 1
                `
      const data = await fnGetDirectData('employees',sql1);

      let sql = `
          SELECT p.* FROM products p WHERE p.companyid = ${companyid} and p.isactive = 1 And p.instock > 0
          `
      const data2 = await fnGetDirectData('products',sql);

      setEmployees(data)
      setProducts(data2)
    } catch (error) {
      setEmployees([])
      setProducts([])
    }

    if(JSON.stringify(order) != "{}"){
      setOrderProducts(order.products)
      setTotal( Math.round(order.order_total * 100) / 100)
    }
    
  }

  const calculateSubtotal = (product) => {
    return product.quantity * product.price;
  };

  const onFinish = (values) => {

    if(orderProducts.length == 0){
      api.warning({
          title: ``,
          description: 'Please add products.',
          placement,duration: 2,
          style: {
              background: "#e2e2e2ff"
          },
      });
      return
    }
  
    const fnSendData = async () => {

      if(JSON.stringify(order) === "{}" ){
          values['companyid'] = sessionStorage.getItem('companyid')
          values['createdby'] = sessionStorage.getItem('uid')
          values['products'] = orderProducts
          const data = await fnCreateData('orders',"orders", values, 'new');
          if(data.insertId != null || data.insertId != undefined){
            let temp = values
            temp['id'] = data.insertId
            setOrder(temp)
            api.success({
                title: ``,
                description: 'Order created successfully.',
                placement,duration: 2,
                style: {
                    background: "#e2e2e2ff"
                },
                onClose: () => {
                    fnGoBack()
                }
            });
          }else{
            api.error({
                title: ``,
                description: 'Something went wrong. Please try again',
                placement,duration: 2,
                style: {
                    background: "#e2e2e2ff"
                },
            });
          }
      }else{
        values['products'] = orderProducts
        values['id'] = order['id']
        const data = await fnUpateData('orders',"orders", values,'id = ? AND isactive = ?',[order['id'],1], 'update');
        if(data?.affectedRows > 0){
          api.success({
              title: ``,
              description: 'Order updated successfully.',
              placement,duration: 2,
              style: {
                  background: "#e2e2e2ff"
              },
              onClose: () => {
                  fnGoBack()
              }
          });
        }else{
          api.warning({
              title: ``,
              description: 'Something went wrong. Please try again',
              placement,duration: 2,
              style: {
              background: "#e2e2e2ff"
              },
          });
        }
      }
    }

    fnSendData()

  }

  const onFinishFailed = (values) => {
    api.warning({
        title: ``,
        description: 'Please complete the required fields.',
        placement,duration: 2,
        style: {
        background: "#e2e2e2ff"
        },
    });
  }

  const fnGetQuantity = (e) => {
    if(e == undefined) return
    let temp = products.filter((itm) => itm.id == e)
    setSelectedProduct(temp[0])
    setInstock(temp[0].instock)
  }

  const fnCalcPrice = (q) => {
    setQuantity(q)
  }

  const fnHandleAddProduct = () => {

    if(quantity > instock){
      api.warning({
            title: ``,
            description: 'Selected quantity is greater than product instock.',
            placement,duration: 2,
            style: {
            background: "#e2e2e2ff"
            },
        });
      return
    }
  
    if(JSON.stringify(selectedProduct) == "{}" || quantity == 0) return

    let obj = {
      id: selectedProduct.id,
      title: selectedProduct.title,
      quantity: quantity,
      price: selectedProduct.price
    }
    setTotal(total + (quantity * selectedProduct.price ))
    setOrderProducts(prev => [...prev, obj])
  };

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
    {contextHolder}
    <div className="container" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
      <div className="card">
        <h2>Order <span>{order.ordernumber}</span></h2> 
        <Form name="basic" initialValues={order} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
          {/* Customer Info */}
            <Row>
                <Col span={11}>
                    <div className="form-group">
                        <label htmlFor="customername">Customer Name</label>
                        <Form.Item name="customername"
                        rules={[
                            {
                            required: true,
                            message: 'Please input customer name!',
                            },]} >
                        <Input />
                        </Form.Item>
                    </div>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <div className="form-group">
                    <label htmlFor="contactnumber">Contact Number</label>
                    <Form.Item name="contactnumber"
                    rules={[
                        {
                        required: true,
                        message: 'Please input contact number!',
                        },]} >
                    <Input />
                    </Form.Item>
                </div>
                </Col>
            </Row>

            <Row>
                <Col span={11}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <Form.Item name="email"
                        rules={[
                            {
                            required: true,
                            message: 'Please input email!',
                            },]} >
                        <Input />
                        </Form.Item>
                    </div>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <div className="form-group">
                    <label htmlFor="orderDate">Order Date</label>
                    <Form.Item name="orderdate" 
                    rules={[
                    {
                        required: true,
                        message: 'Please select a order Date!',
                    },
                    ]}>
                    <input type="datetime-local"></input>
                    </Form.Item>
                </div>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <div className="form-group">
                        <label htmlFor="deliveryAddress">Delivery Address</label>
                        <Form.Item label="" name="deliveryaddress" 
                        rules={[
                            {
                                required: true,
                                message: 'Please select a delivery adddress!',
                            },
                            ]} >
                            <TextArea rows={3}  />
                        </Form.Item>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={11}>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <Form.Item
                        name="status"
                        rules={[
                            {
                            required: true,
                            message: 'Please select a status!',
                            },
                        ]}
                        >
                        <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                        allowClear={true} placeholder="Please select a status" size='large'>
                            {
                            order_status?.map((itm,key) => (
                                <Option value={itm.id} key={key}>{itm.label}</Option>
                            ))
                            }
                        </Select>
                        </Form.Item>
                    </div>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <div className="form-group">
                    <label htmlFor="assignTo">Assign Order To</label>
                    <Form.Item name="assignto" 
                    rules={[
                        {
                        required: true,
                        message: 'Please assign an order to a user!',
                        },
                    ]}>
                    <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                    allowClear={true} placeholder="Please select a user" size='large'>
                        {
                        employees?.map((itm,key) => (
                            <Option value={itm.id} key={key}>{itm?.firstname} {itm?.lastname}</Option>
                        ))
                        }
                    </Select>
                    </Form.Item>
                </div>
                </Col>
            </Row>
            
            {
              JSON.stringify(order) != "{}" ? (null):(
                <>
                  <Row>
                    <Col span={11}>
                        <Select showSearch filterOption={(input, option) =>(option?.title ?? '').toLowerCase().includes(input.toLowerCase())} 
                        allowClear={true} placeholder="Please select a product" style={{width: '100%'}} size='large' onChange={(e) => fnGetQuantity(e)}>
                            {
                            products?.map((itm,key) => (
                                <Option value={itm.id} key={key}>{itm.title}</Option>
                            ))
                            }
                        </Select>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <input
                        type="number"
                        placeholder="Qty"
                        onChange={(e) => fnCalcPrice(e.target.value)}
                        />
                    </Col>
                  </Row>

                  <button
                    type="button"
                    className="btn add-product"
                    onClick={fnHandleAddProduct}
                  >
                    + Add Product
                  </button>
                </>
              )
            }
            

          {/* Product List Table */}
          <div className="product-list">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderProducts.map((product,key) => (
                  <tr key={key}>
                    <td>{product.title}</td>
                    <td>{product.quantity}</td>
                    <td>${product.price}</td>
                    <td>${calculateSubtotal(product)}</td>
                  </tr>
                ))}
                {orderProducts.length > 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      Total:
                    </td>
                    <td style={{ fontWeight: 'bold' }}>
                      ${total}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" style={{backgroundColor: '#1092a7', color: '#fff'}}>
              Save Order
            </Button>
            <Button type="default" onClick={() => fnGoBack()} style={{ marginLeft: 15}}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    </Context.Provider>
  );
};

export default CreateOrder;